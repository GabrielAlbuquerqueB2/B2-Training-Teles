import { serialize } from 'cookie'

export function setResponseCookie(res, encodedSessionData) {
    res.setHeader('Set-Cookie', serialize('session', encodedSessionData, { path: '/' }))
}