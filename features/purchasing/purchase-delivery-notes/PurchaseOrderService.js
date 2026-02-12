import axios from 'axios'
import Api from '../../../lib/api'
import { getPurchaseOrderById } from './PurchaseDeliveryNotesServices'

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

export async function getOrder(docEntry) {
    const po = await getPurchaseOrderById(docEntry)
    const itemCodesList = po.DocumentLines.map(item =>  item.ItemCode)
    const groupCodes = await getItemsUoMGroupCodes(itemCodesList)
    const itemsWithAlternateUoMs = await getUoMGroupAlternateUoMList(groupCodes)
    const mappedList = await mapAlternateUoMList(itemsWithAlternateUoMs)
    const finalPurchaseOrder = await bindPurchaseOrderWithUoMs(po, mappedList)
    return finalPurchaseOrder
}

async function getItemsUoMGroupCodes(itemCodeList) {

    const filters = itemCodeList.map(item => {
        return `ItemCode eq '${item}'`
    }).join(' or ')   

    const query = new Api()
        .setMethod('GET')
        .setUrl(`/Items`)
        .setParams({
            $select: 'ItemCode,UoMGroupEntry',
            $filter: filters
        })
        .get()

    const data = await doApiCall(query)
    return data.value
}

async function getUoMGroupAlternateUoMList(absoluteEntryList) {


    const filters = absoluteEntryList.map(item => {
        return `AbsEntry eq ${item.UoMGroupEntry}`
    }).join(' or ')   

    const query = new Api()
        .setMethod('GET')
        .setUrl(`/UnitOfMeasurementGroups`)
        .setParams({
            $select: 'AbsEntry,UoMGroupDefinitionCollection',
            $filter: filters
        })
        .get()

    const data = await doApiCall(query)
    
    const mappedData = absoluteEntryList.map(item => {
        const uomList = data.value.find(({AbsEntry}) => AbsEntry === item.UoMGroupEntry)
        return {
            ...item,
            ...uomList
        }
    })
    return mappedData
}


async function mapAlternateUoMList(itemWithUoMList) {

    const query = new Api()
    .setMethod('GET')
    .setUrl(`/UnitOfMeasurementsService_GetList`)   
    .get()

    const data = await doApiCall(query)

    const final = itemWithUoMList.map(item => {        
        
        const uomData = item.UoMGroupDefinitionCollection.map(unit => {
            const mapped = data.value.find(({AbsEntry}) => AbsEntry === unit.AlternateUoM)
            return {
                value: mapped.AbsEntry,
                description: mapped.Code
            }
        })
        return {
            ...item,
            UoMList: { ...uomData }
        }
    })
    return final
}

async function bindPurchaseOrderWithUoMs(purchaseOrder, uomList) {

    const  docLines = purchaseOrder.DocumentLines.map(line => {
        const uoms = uomList.find(({ItemCode}) => ItemCode === line.ItemCode)
        return {
            ...line,
            UoMList: {... uoms.UoMList }
        }
    })
    return {
        ...purchaseOrder,
        DocumentLines: docLines
    }
}