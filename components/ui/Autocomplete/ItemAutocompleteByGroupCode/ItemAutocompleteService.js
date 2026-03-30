import axios from 'axios'
import Api from '../../../../lib/api'

export async function getItemListByDescription(description, groupCode) {

    const uppercaseDescription = description.toUpperCase()

    const filter = groupCode ?
        `ItemsGroupCode eq ${groupCode} and (Valid eq 'tYES' and MaterialType ne 'mt_GoodsForReseller') and (contains(ItemCode, '${uppercaseDescription}') or contains(ItemName, '${uppercaseDescription}'))` :
        `(Valid eq 'tYES' and MaterialType ne 'mt_GoodsForReseller') and (contains(ItemCode, '${uppercaseDescription}') or contains(ItemName, '${uppercaseDescription}'))`

    const query = new Api()
        .setMethod('GET')
        .setUrl('/Items')
        .setParams({
            $select: 'ItemCode,ItemName,InventoryUOM,UoMGroupEntry,InventoryUoMEntry',
            $filter: filter,
            $orderby: 'ItemName'
        })
        .get()

    return axios.request(query)
        .then((response) => {
            return mapItemListToAutocompleteOptions(response.data.value)
        }).catch((error) => {
            console.error('[ItemService] Erro na query:', error?.response?.data || error)
            throw new Error(error)
        })
}

function mapItemListToAutocompleteOptions(itemList) {
    return itemList.map(item => {
        return {
            id: item.ItemCode,
            label: item.ItemName,
            InventoryUOM: item.InventoryUOM,       // código texto da UM padrão ex: 'UN'
            UoMGroupEntry: item.UoMGroupEntry,     // ID do grupo de UM (era UgpEntry)
            InventoryUoMEntry: item.InventoryUoMEntry // AbsEntry da UM padrão
        }
    })
}