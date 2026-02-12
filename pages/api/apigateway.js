import { parseCookies } from 'nookies'
import { decodeSessionData } from '../../lib/serviceLayerProxy'
import { makeApiGatewayRequest } from '../../lib/apiGatewayProxy'
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

export default async function handler(req, res) {

    const cookies = parseCookies({ req })

    if (cookies.session) {

        const decoded = decodeSessionData(cookies.session)
        const requestResult = await makeApiGatewayRequest(req, decoded.APIGatewayToken)        
        res.send(requestResult)    

    } else {
        res.status(403).send({ error: '403 - Forbidden' })
    }
}