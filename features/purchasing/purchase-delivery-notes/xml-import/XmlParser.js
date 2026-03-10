import { XMLParser } from 'fast-xml-parser'

export function parseXmlContent(xmlString) {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        removeNSPrefix: true,
        parseTagValue: false
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

    const nomeEmitente = emit.xNome || ''
    const fantasiaEmitente = emit.xFant || ''

    const ide = infNFe.ide || {}
    const nNF = String(ide.nNF || '')
    const serie = String(ide.serie || '')
    const dhEmi = ide.dhEmi || ''
    const natOp = ide.natOp || ''

    const total = infNFe.total?.ICMSTot || {}
    const vNF = parseFloat(total.vNF) || 0
    const vProd = parseFloat(total.vProd) || 0
    const vFrete = parseFloat(total.vFrete) || 0
    const vDesc = parseFloat(total.vDesc) || 0

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
            cEAN: String(prod.cEAN || ''),
            xProd: String(prod.xProd || ''),
            NCM: String(prod.NCM || ''),
            CFOP: String(prod.CFOP || ''),
            uCom: String(prod.uCom || ''),
            qCom: parseFloat(prod.qCom) || 0,
            vUnCom: parseFloat(prod.vUnCom) || 0,
            vProd: parseFloat(prod.vProd) || 0,
            cEANTrib: String(prod.cEANTrib || ''),
            uTrib: String(prod.uTrib || ''),
            qTrib: parseFloat(prod.qTrib) || 0,
            vUnTrib: parseFloat(prod.vUnTrib) || 0,
            nItemPed: prod.nItemPed ? parseInt(prod.nItemPed, 10) : null
        }
    }).filter(Boolean)

    return {
        cnpj,
        nomeEmitente,
        fantasiaEmitente,
        nNF,
        serie,
        dhEmi,
        natOp,
        vNF,
        vProd,
        vFrete,
        vDesc,
        itens
    }
}

export function formatXmlDate(isoDate) {
    if (!isoDate) return ''
    try {
        const date = new Date(isoDate)
        return date.toLocaleDateString('pt-BR')
    } catch {
        return isoDate
    }
}
