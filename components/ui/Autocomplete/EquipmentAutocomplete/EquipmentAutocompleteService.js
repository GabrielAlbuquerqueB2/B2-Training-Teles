import axios from 'axios'
import Api from '../../../../lib/api'

export async function getEquipmentListByDescription(description, location) {

    const uppercaseDescription = description.toUpperCase()

    // TO-DO: Mapear AssetGroup 109 para parametro
    const query = new Api()
        .setMethod('GET')
        .setUrl('/Items')
        .setParams({
            $select: 'ItemCode,ItemName,InventoryNumber',            
            //$filter: `(AssetGroup eq '001' and Location eq ${location}) and (contains(ItemCode, '${uppercaseDescription}') or contains(ItemName, '${uppercaseDescription}') or contains(InventoryNumber, '${uppercaseDescription}'))`
            //$filter: `(AssetGroup eq '001') and (contains(ItemCode, '${uppercaseDescription}') or contains(ItemName, '${uppercaseDescription}') or contains(InventoryNumber, '${uppercaseDescription}'))`
            $filter: `(ItemType eq 'itFixedAssets') and (contains(ItemCode, '${uppercaseDescription}') or contains(ItemName, '${uppercaseDescription}') or contains(InventoryNumber, '${uppercaseDescription}'))`
        })
        .get()

        return axios.request(query)
        .then((response) => {
            return mapEquipmentListToAutocompleteOptions(response.data.value)
        }).catch((error) => {
            throw new Error(error)
        })
}

function mapEquipmentListToAutocompleteOptions(equipmentsList) {

    return equipmentsList.map(equipment => {
        return {
            id: equipment.ItemCode,
            label: ( equipment.InventoryNumber + ' - ' + equipment.ItemName )
        }
    })   

}