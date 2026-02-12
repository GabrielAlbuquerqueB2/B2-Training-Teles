import axios from 'axios'
import Api from '../../../../lib/api'

export async function getBPListByDescription(description) {

    const uppercaseDescription = description.toUpperCase()

    const query = new Api()
        .setMethod('GET')
        .setUrl('/BusinessPartners')
        .setParams({
            $select: 'CardCode,CardName,FederalTaxID',
            $filter: `CardType eq 'cCustomer' and Valid eq 'tYES' and (contains(CardCode, '${uppercaseDescription}') or contains(CardName, '${uppercaseDescription}') or contains(FederalTaxID, '${uppercaseDescription}'))`
        })
        .get()

    return axios.request(query)
        .then((response) => {
            return mapBPListToAutocompleteOptions(response.data.value)
        }).catch((error) => {
            throw new Error(error)
        })
}

export async function getBPByCardCode(cardCode) {

    const query = new Api()
        .setMethod('GET')
        .setUrl(`/BusinessPartners('${cardCode}')`)
        .setParams({
            $select: 'CardCode,CardName,FederalTaxID'           
        })
        .get()

    return axios.request(query)
        .then((response) => {
            return mapBPListToAutocompleteOptions([{...response.data}])
        }).catch((error) => {
            console.log(error)
        })

}

function mapBPListToAutocompleteOptions(bpList) {

    return bpList.map(bp => {
        return {
            id: bp.CardCode,
            label: bp.CardName + ' - ' + bp.FederalTaxID
        }
    })

}