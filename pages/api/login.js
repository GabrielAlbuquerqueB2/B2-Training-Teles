
import serviceLayerLogin from '../../features/authentication/services/serviceLayerLogin'
import { setResponseCookie } from '../../features/authentication/services/serviceLayerCookieHandler'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

export default async function handler(req, res) {

  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

  const { user, password } = req.body

  const encodedSessionData = await serviceLayerLogin(user, password, res)     

  if(encodedSessionData.response?.data.error) {
    
    res.status(encodedSessionData.response.status).send(encodedSessionData.response.data)
  } else {

    await setResponseCookie(res, encodedSessionData) 
    res.status(200).send(encodedSessionData)
  }
}