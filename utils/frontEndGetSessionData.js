import { parseCookies } from 'nookies'
import { decodeSessionData } from '../features/authentication/services/authenticationProviderService'

export function getSessionData(encodedSessionData) {

    const cookies = parseCookies()

    if(cookies) {
        return decodeSessionData(cookies)

    } else {
        return false
    }
}
