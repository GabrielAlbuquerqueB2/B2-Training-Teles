import axios from 'axios'
import Api from '../../../../lib/api'

export async function getBatchListByDescription(description) {

    const uppercaseDescription = description.toUpperCase()

    const query = new Api()
        .setMethod('POST')
        .setUrl('/QueryService_PostQuery')
        .setData({
            QueryPath: "$crossjoin(BatchNumberDetails, Items)",
            QueryOption: `$expand=BatchNumberDetails($select=DocEntry,Batch),Items($select=U_B2AG_VarietyDescription)&$filter=BatchNumberDetails/ItemCode eq Items/ItemCode and contains(BatchNumberDetails/Batch, '${uppercaseDescription}')`
        })
        .get()
        return axios.request(query)
        .then((response) => {
            return mapBatchListToAutocompleteOptions(response.data.value)
        }).catch((error) => {
            throw new Error(error)
        })
}

function mapBatchListToAutocompleteOptions(itemList) {

    return itemList.map(item => {
        return {
            id: item.BatchNumberDetails.Batch,
            label: item.Items.U_B2AG_VarietyDescription,
            Variety: item.Items.U_B2AG_VarietyDescription
        }
    })   

}