import axios from 'axios'
import Api from '../../../../lib/api'

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

export function mapDataToSelectComponent(items) {
    if (!items) return;

    return items.map((item) => {
        return {
            value: item.Code,
            description: item.Name
        }
    })
}

export async function getAllCrops() {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/Crop')
        .get()

    const result = await doApiCall(query)
    const data = mapDataToSelectComponent(result.value)
    return data
}
