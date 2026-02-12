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
            console.log(error)
            return error
        })
}

export async function getAllUsages() {
    
    const query = new Api()
    .setMethod('GET')
    .setUrl('/NotaFiscalUsage')
    .setParams({
        $select: 'ID,Usage',
        $orderby: 'Usage'
    })
    .get()
    
    const result = await doApiCall(query)
    return mapUsagesToSelect(result.value)
}

function mapUsagesToSelect(usages) {
    return usages.map(item => {
        return {
            value: item.ID,
            description: item.Usage
        }
    })
}