import axios from 'axios'

export function makeApiGatewayRequest(req, cookieToken) {

    const URL = process.env.B1_API_GATEWAY_URL

    const options = {
        method: 'POST',
        url: `${URL}/rs/v1/ExportPDFData`,
        params: req.body.params,
        headers: {
            cookie: cookieToken,
            'Content-Type': 'application/json'
        },
        data: req.body.data
    }   

    return axios.request(options).then(function (response) {                
        return response.data
    }).catch(function (error) {
        return error
    })       
}