import axios from 'axios'
import { decrypt } from '../../utils/textCrypto'
import serviceLayerLogin from '../../features/authentication/services/serviceLayerLogin'

export function decodeSessionData(encodedSessionData) {

    const decodedSessionData = JSON.parse(Buffer.from(encodedSessionData, 'base64').toString('ascii'))
    decodedSessionData.password = decrypt(decodedSessionData.password)
    return decodedSessionData
}

export function isTokenExpired(datetimeCreation, sessionTimeoutInMinutes) {

    const TOLERANCE_IN_MINUTES = 5

    if (!datetimeCreation || !sessionTimeoutInMinutes)
        return true

    const date = new Date(datetimeCreation);
    const now = new Date();
    const differenceInMiliseconds = now - date
    const differenceInMinutes = Math.round(differenceInMiliseconds / 60000);

    return differenceInMinutes >= (sessionTimeoutInMinutes + TOLERANCE_IN_MINUTES)
}

export async function renewExpiredToken(user, password) {

    const encodedSessionData = await serviceLayerLogin(user, password)
    return encodedSessionData
}

export async function makeServiceLayerRequest(req, cookieToken) {

    const B1_URL = process.env.B1_SERVICE_LAYER_URL
    const { method, url, params, data, userData } = req.body

    const options = {
        method: method,
        url: `${B1_URL}${url}`,
        params: params,
        headers: {
            'content-type': 'application/json',
            Prefer: 'odata.maxpagesize=0',
            'B1S-ReplaceCollectionsOnPatch': true,
            'cookie': cookieToken
        },
        data: userData
    }

    try {
        let response = await axios(options)
        return response.data
    } catch (error) {
        return error
    }

}

export async function respondToClient(res, requestResult) {   
 
    if(requestResult.response?.data.error) {
        res.status(requestResult.response.status).send(requestResult.response.data.error)
    } else {
        res.send(requestResult)
    }
}