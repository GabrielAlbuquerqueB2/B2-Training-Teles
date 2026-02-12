import axios from 'axios'
import Api from '../../../../lib/api'

export async function getItemListByDescription(description) {

    const uppercaseDescription = description.toUpperCase()

    const query = new Api()
        .setMethod('GET')
        .setUrl('/ProductTrees')
        .setParams({
            $select: 'TreeCode,ProductDescription',
            $filter: `contains(TreeCode, '${uppercaseDescription}') or contains(ProductDescription, '${uppercaseDescription}')`
        })
        .get()

        return axios.request(query)
        .then((response) => {
            return mapItemListToAutocompleteOptions(response.data.value)
        }).catch((error) => {
            throw new Error(error)
        })
}

function mapItemListToAutocompleteOptions(itemList) {

    return itemList.map(item => {
        return {
            id: item.TreeCode,
            label: item.ProductDescription
        }
    })   

}