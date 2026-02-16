import axios from 'axios'
import { parseCookies } from 'nookies'
import { isTokenExpired, decodeSessionData, renewExpiredToken } from '../../../lib/serviceLayerProxy'
import { setResponseCookie } from '../../../features/authentication/services/serviceLayerCookieHandler'
import { normalizeCatalogCode } from '../../../utils/normalizeCatalogCode'
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

const B1_URL = process.env.B1_SERVICE_LAYER_URL

async function sapRequest(method, url, cookieToken, data = null) {
    const options = {
        method,
        url: `${B1_URL}${url}`,
        headers: {
            'content-type': 'application/json',
            Prefer: 'odata.maxpagesize=0',
            cookie: cookieToken
        }
    }
    if (data) {
        options.data = data
    }
    const response = await axios(options)
    return response.data
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
        const { cardCode, vendorItemCode, itemCode } = req.body

        if (!cardCode || !vendorItemCode || !itemCode) {
            return res.status(400).send({ error: 'Campos obrigatórios: cardCode, vendorItemCode, itemCode' })
        }

        const cookieToken = await getSessionToken(req, res)

        const normalizedCode = normalizeCatalogCode(vendorItemCode)

        await sapRequest('POST', '/AlternateCatNum', cookieToken, {
            ItemCode: itemCode,
            CardCode: cardCode,
            Substitute: normalizedCode,
        })

        return res.send({ success: true })

    } catch (error) {
        if (error.message === '403 - Forbidden') {
            return res.status(403).send({ error: '403 - Forbidden' })
        }

        if (error.response?.status === 400) {
            const sapMessage = error.response?.data?.error?.message?.value || ''
            if (sapMessage.includes('already exists') || sapMessage.includes('já existe') || sapMessage.includes('1320000205')) {
                return res.send({ success: true, alreadyExists: true })
            }
            return res.status(400).send({ error: sapMessage || 'Erro ao criar vínculo no SAP.' })
        }

        return res.status(500).send({ error: error.message || 'Erro interno ao criar vínculo.' })
    }
}
