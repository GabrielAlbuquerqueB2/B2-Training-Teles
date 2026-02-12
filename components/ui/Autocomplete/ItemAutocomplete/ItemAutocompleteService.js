import axios from 'axios'
import Api from '../../../../lib/api'

export async function getItemListByDescription(description) {

    const uppercaseDescription = description.toUpperCase()

    const query = new Api()
        .setMethod('GET')
        .setUrl('/Items')
        .setParams({
            $select: 'ItemCode,ItemName,InventoryUOM',
            $filter: `(Valid eq 'tYES' and MaterialType ne 'mt_GoodsForReseller') and (contains(ItemCode, '${uppercaseDescription}') or contains(ItemName, '${uppercaseDescription}'))`
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
            id: item.ItemCode,
            label: item.ItemName,
            InventoryUOM: item.InventoryUOM
        }
    })   

}