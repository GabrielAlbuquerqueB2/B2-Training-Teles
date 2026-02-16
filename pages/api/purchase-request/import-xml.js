import multiparty from 'multiparty'
import fs from 'fs'
import { XMLParser } from 'fast-xml-parser'
import axios from 'axios'
import { parseCookies } from 'nookies'
import { isTokenExpired, decodeSessionData, renewExpiredToken } from '../../../lib/serviceLayerProxy'
import { setResponseCookie } from '../../../features/authentication/services/serviceLayerCookieHandler'
import { normalizeCatalogCode } from '../../../utils/normalizeCatalogCode'
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

const B1_URL = process.env.B1_SERVICE_LAYER_URL

function parseFormData(req) {
    return new Promise((resolve, reject) => {
        const form = new multiparty.Form()
        form.parse(req, (err, fields, files) => {
            if (err) return reject(err)
            resolve({ fields, files })
        })
    })
}

function parseXmlContent(xmlString) {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        removeNSPrefix: true
    })
    const parsed = parser.parse(xmlString)

    const nfeProc = parsed.nfeProc || parsed
    const NFe = nfeProc.NFe || nfeProc
    const infNFe = NFe.infNFe
    if (!infNFe) {
        throw new Error('XML inválido: tag <infNFe> não encontrada.')
    }

    const emit = infNFe.emit
    if (!emit) {
        throw new Error('XML inválido: tag <emit> (emitente) não encontrada.')
    }

    const cnpj = String(emit.CNPJ || '')
    if (!cnpj) {
        throw new Error('XML inválido: CNPJ do emitente não encontrado.')
    }

    const nNF = String(infNFe.ide?.nNF || '')

    let detArray = infNFe.det
    if (!detArray) {
        throw new Error('XML inválido: nenhum item encontrado (tag <det>).')
    }
    if (!Array.isArray(detArray)) {
        detArray = [detArray]
    }

    const itens = detArray.map((det, i) => {
        const prod = det.prod
        if (!prod) return null
        return {
            nItem: det['@_nItem'] || String(i + 1),
            cProd: String(prod.cProd || ''),
            xProd: String(prod.xProd || ''),
            NCM: String(prod.NCM || ''),
            qCom: parseFloat(prod.qCom) || 0,
            vUnCom: parseFloat(prod.vUnCom) || 0,
            uCom: String(prod.uCom || '')
        }
    }).filter(Boolean)

    return { cnpj, nomeEmitente: emit.xNome || '', fantasiaEmitente: emit.xFant || '', nNF, itens }
}

async function sapRequest(method, url, cookieToken, params = {}) {
    const options = {
        method,
        url: `${B1_URL}${url}`,
        params,
        headers: {
            'content-type': 'application/json',
            Prefer: 'odata.maxpagesize=0',
            cookie: cookieToken
        }
    }
    const response = await axios(options)
    return response.data
}

function formatCNPJ(cnpj) {
    const digits = cnpj.replace(/\D/g, '')
    if (digits.length === 14) {
        return `${digits.slice(0,2)}.${digits.slice(2,5)}.${digits.slice(5,8)}/${digits.slice(8,12)}-${digits.slice(12,14)}`
    }
    return digits
}

function stripCNPJ(cnpj) {
    return cnpj.replace(/\D/g, '')
}

async function findVendorByCNPJ(cnpj, cookieToken) {
    const raw = stripCNPJ(cnpj)
    const formatted = formatCNPJ(cnpj)

    const result = await sapRequest('GET', '/BusinessPartners', cookieToken, {
        $select: 'CardCode,CardName,FederalTaxID',
        $filter: `CardType eq 'cSupplier' and (FederalTaxID eq '${raw}' or FederalTaxID eq '${formatted}')`
    })

    if (result.value && result.value.length > 0) {
        return result.value[0]
    }
    return null
}

async function getItemDetails(itemCode, cookieToken) {
    try {
        const result = await sapRequest('GET', `/Items('${itemCode}')`, cookieToken, {
            $select: 'ItemCode,ItemName,InventoryUOM,DefaultPurchasingUoMEntry,InventoryUoMEntry'
        })
        return {
            itemName: result.ItemName || itemCode,
            measureUnit: result.InventoryUOM || '',
            uoMEntry: result.DefaultPurchasingUoMEntry || result.InventoryUoMEntry || null,
        }
    } catch (err) {
        return { itemName: itemCode, measureUnit: '', uoMEntry: null }
    }
}

async function findItemByAlternateCatNum(cProd, cardCode, cookieToken, vendorCatalogCache) {
    const normalizedCProd = normalizeCatalogCode(cProd)
    const normalizedCardCode = String(cardCode).trim()

    try {
        const result = await sapRequest('GET', '/AlternateCatNum', cookieToken, {
            $filter: `CardCode eq '${normalizedCardCode}' and Substitute eq '${normalizedCProd}'`,
            $select: 'ItemCode'
        })
        if (result.value && result.value.length > 0) {
            return result.value[0]
        }
    } catch (err) {
    }

    let catalog = vendorCatalogCache.get(normalizedCardCode)
    if (!catalog) {
        try {
            const allResult = await sapRequest('GET', '/AlternateCatNum', cookieToken, {
                $filter: `CardCode eq '${normalizedCardCode}'`,
                $select: 'ItemCode,Substitute'
            })
            catalog = allResult.value || []
            vendorCatalogCache.set(normalizedCardCode, catalog)
        } catch (err) {
            catalog = []
            vendorCatalogCache.set(normalizedCardCode, catalog)
        }
    }

    const match = catalog.find(entry => normalizeCatalogCode(entry.Substitute) === normalizedCProd)
    if (match) {
        return { ItemCode: match.ItemCode }
    }

    return null
}

async function getSessionToken(req, res) {
    const cookies = parseCookies({ req })
    if (!cookies.session) {
        throw new Error('403 - Forbidden')
    }

    const decoded = decodeSessionData(cookies.session)

    if (isTokenExpired(decoded.datetimeCreation, decoded.SessionTimeout)) {
        const renewedToken = await renewExpiredToken(decoded.user, decoded.password)
        await setResponseCookie(res, renewedToken)
        const newDecoded = decodeSessionData(renewedToken)
        return newDecoded.cookieToken
    }

    return decoded.cookieToken
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send({ error: 'Method not allowed' })
    }

    try {
        const cookieToken = await getSessionToken(req, res)

        const { files } = await parseFormData(req)
        const fileArray = files.file || files[Object.keys(files)[0]]
        if (!fileArray || fileArray.length === 0) {
            return res.status(400).send({ error: 'Nenhum arquivo XML enviado.' })
        }

        const xmlBuffer = fs.readFileSync(fileArray[0].path)
        const xmlString = xmlBuffer.toString('utf-8')

        const { cnpj, nomeEmitente, nNF, itens } = parseXmlContent(xmlString)

        const vendor = await findVendorByCNPJ(cnpj, cookieToken)

        let cardCode = null
        let cardName = null
        if (vendor) {
            cardCode = vendor.CardCode
            cardName = vendor.CardName
        }

        const vendorCatalogCache = new Map()
        const processedItems = []
        for (const item of itens) {
            let itemCodeSAP = null
            let itemNameSAP = null
            let measureUnit = ''
            let uoMEntry = null
            let status = 'nao_encontrado'

            if (cardCode) {
                const match = await findItemByAlternateCatNum(item.cProd, cardCode, cookieToken, vendorCatalogCache)
                if (match) {
                    itemCodeSAP = match.ItemCode
                    const details = await getItemDetails(match.ItemCode, cookieToken)
                    itemNameSAP = details.itemName
                    measureUnit = details.measureUnit
                    uoMEntry = details.uoMEntry
                    status = 'encontrado'
                }
            }

            processedItems.push({
                cProd: item.cProd,
                xProd: item.xProd,
                qCom: item.qCom,
                vUnCom: item.vUnCom,
                uCom: item.uCom,
                NCM: item.NCM,
                itemCodeSAP,
                itemNameSAP,
                measureUnit,
                uoMEntry,
                status
            })
        }

        const unmatchedCount = processedItems.filter(i => i.status === 'nao_encontrado').length

        res.send({
            CardCode: cardCode,
            CardName: cardName,
            nNF,
            nomeEmitente,
            items: processedItems,
            unmatchedCount,
            totalItems: processedItems.length
        })

    } catch (error) {
        if (error.message === '403 - Forbidden') {
            return res.status(403).send({ error: '403 - Forbidden' })
        }
        return res.status(500).send({ error: error.message || 'Erro interno ao processar XML.' })
    }
}

export const config = {
    api: {
        bodyParser: false,
    }
}
