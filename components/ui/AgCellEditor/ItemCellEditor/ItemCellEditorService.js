import axios from 'axios'
import Api from '../../../../lib/api'

export async function getItemListByDescription(description) {

    const uppercaseDescription = description.toUpperCase()

    const query = new Api()
        .setMethod('GET')
        .setUrl('/Items')
        .setParams({
            $select: 'ItemCode,ItemName',
            $filter: `contains(ItemCode, '${uppercaseDescription}') or contains(ItemName, '${uppercaseDescription}')`
        })
        .get()

        return axios.request(query)
        .then((response) => {
            return response.data.value
        }).catch((error) => {
            throw new Error(error)
        })
}