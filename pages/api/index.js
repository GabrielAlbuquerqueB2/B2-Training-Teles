import { parseCookies } from 'nookies'
import { isTokenExpired, decodeSessionData, 
    renewExpiredToken, makeServiceLayerRequest, respondToClient 
} from '../../lib/serviceLayerProxy'
import { setResponseCookie } from '../../features/authentication/services/serviceLayerCookieHandler'
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

export default async function handler(req, res) {

    const cookies = parseCookies({ req })

    if (cookies.session) {

        const decoded = decodeSessionData(cookies.session)

        if (isTokenExpired(decoded.datetimeCreation, decoded.SessionTimeout)) {
            
            const renewedToken = await renewExpiredToken(decoded.user, decoded.password)
            const newTokenDecoded = decodeSessionData(renewedToken)
            const requestResult = await makeServiceLayerRequest(req, newTokenDecoded.cookieToken)
            await setResponseCookie(res, renewedToken)
            await respondToClient(res, requestResult)
            
        } else {            
            
            const requestResult = await makeServiceLayerRequest(req, decoded.cookieToken)
            await respondToClient(res, requestResult) 

        }

    } else {
        res.status(403).send({ error: '403 - Forbidden' })
    }    
}