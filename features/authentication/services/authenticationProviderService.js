import { parseCookies } from 'nookies'

export function decodeSessionData(encodedSessionData) {

    if(encodedSessionData.session) {
        return Buffer.from(encodedSessionData.session, 'base64').toString('ascii')    
    } else {
        return false
    }
}

function validateSession(session) {

    const { user, password, isLoggedIn, cookieToken, SessionId, Version } = JSON.parse(session)

    if (user && password && isLoggedIn && cookieToken && SessionId && Version) {
        return true
    } else {
        return false
    }
}

export function isLoggedIn() {

    const cookies = parseCookies()
    if(cookies) {
        const decoded = decodeSessionData(cookies)
        return validateSession(decoded)   
    } else {
        return false
    }
}