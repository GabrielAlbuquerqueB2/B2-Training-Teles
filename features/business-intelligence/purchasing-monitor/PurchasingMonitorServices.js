import axios from 'axios'
import Api from '../../../lib/api'

async function doApiCall(query) {

    return axios.request(query)
        .then((response) => {
            if (response.data) {
                return response.data
            } else {
                return {}
            }
        }).catch((error) => {
            return (error.response)
        })
}

export async function getPurchasingMonitor() {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/sml.svc/PURCHASE_MONITOR')
        .get()

    const data = await doApiCall(query)
    return data.value
}