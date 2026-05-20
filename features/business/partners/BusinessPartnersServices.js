import axios from 'axios'
import Api from '../../../lib/api'

function mapCardType(cardType) {
    if (cardType === 'C') return 'cCustomer'
    if (cardType === 'S') return 'cSupplier'
    if (cardType === 'cCustomer' || cardType === 'cSupplier') return cardType
    return ''
}

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

export async function createBusinessPartner(businessPartnerData) {

    const query = new Api()
        .setMethod('POST')
        .setUrl('/BusinessPartners')
        .setData(businessPartnerData)
        .get()

    const result = await doApiCall(query)
    if (result.status === 400) {
        const errorMessage = result ? result.data.message.value : 'Unknown error'
        throw new Error(errorMessage)
    }
    return result
}

export async function getBusinessPartnerById(cardCode) {

    const query = new Api()
        .setMethod('GET')
        .setUrl(`/BusinessPartners('${cardCode}')`)
        .get()

    const data = await doApiCall(query)
    if (data) {
        data.CardType = mapCardType(data.CardType)
    }
    return data
}

export async function editBusinessPartner(cardCode, businessPartnerData) {

    const query = new Api()
        .setMethod('PATCH')
        .setUrl(`/BusinessPartners('${cardCode}')`)
        .setData(businessPartnerData)
        .get()

    const result = await doApiCall(query)
    
    if (result.status === 400) {
        const errorMessage = result ? result.data.message.value : 'Unknown error'
        throw new Error(errorMessage)
    }
    return result
}

export async function getAllBusinessPartners(filters = {}) {

    let filterQuery = ''
    if (filters.initialDate && filters.finalDate) {
        filterQuery = `UpdateDate ge '${filters.initialDate}' and UpdateDate le '${filters.finalDate}'`
    }

    const params = {
        $select: 'CardCode,CardName,FederalTaxID,Phone1,EmailAddress,CardType,UpdateDate',
        $orderby: 'UpdateDate desc',
        $top: 3000
    }

    if (filterQuery) {
        params.$filter = filterQuery
    }

    const query = new Api()
        .setMethod('GET')
        .setUrl('/BusinessPartners')
        .setParams(params)
        .get()

    const data = await doApiCall(query)
    if (data?.value) {
        return data.value.map(item => ({
            ...item,
            CardType: mapCardType(item.CardType)
        }))
    }
    return []
}

export async function getStates() {

    const query = new Api()
        .setMethod('GET')
        .setUrl('/States')
        .get()

    const data = await doApiCall(query)
    return data?.value || []
}

export async function getBusinessPartnerSeries() {

    const query = new Api()
        .setMethod('POST')
        .setUrl('/SeriesService_GetDocumentSeries')
        .setData({ DocumentTypeParams: { Document: 2 } })
        .get()

    const data = await doApiCall(query)
    return data?.value || []
}
