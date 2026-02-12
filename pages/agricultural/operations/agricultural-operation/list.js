import { useState, useEffect } from 'react'
import PageHeader from '../../../../components/ui/PageHeader'
import AgriculturalOperationGrid from '../../../../features/agricultural/operations/agricultural-operation/AgriculturalOperationGrid'
import AgriculturalOperationListFilters from '../../../../features/agricultural/operations/agricultural-operation/AgriculturalOperationListFilters'
import { getAgriculturalOperationsExits } from '../../../../features/agricultural/operations/agricultural-operation/AgriculturalOperationServices'
import getTranslation from '../../../../locales/getTranslation'

export default function AgriculturalOperationList() {

    const t = getTranslation()
    const [data, setData] = useState([])
    const [filters, setFilters] = useState({})
    const [initialLoad, setInitialLoad] = useState(true)

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0]
        const lastDays = new Date();
        lastDays.setTime(lastDays.getTime() - 15 * 24 * 60 * 60 * 1000);
        const lastDaysString = lastDays.toISOString().split('T')[0]
        setFilters({
            initalDate: lastDaysString,
            finalDate: today
        })
    }, [])

    useEffect(() => {
        async function fetchData() {
            if (!filters.initalDate || !filters.finalDate || !initialLoad) return

            const branches = sessionStorage.getItem('Branches')
            const branchesArray = JSON.parse(branches)
            const branchIds = branchesArray.map((item => {
                return item.BusinessPlaces.BPLID
            }))
            const uniqueBranchList = [...new Set(branchIds)]
            const exits = await getAgriculturalOperationsExits(uniqueBranchList, filters)
            const mappedObject = exits.map(item => {
                return {
                    DocEntry: item.InventoryGenExits.DocEntry,
                    DocNum: item.InventoryGenExits.DocNum,
                    DocDate: item.InventoryGenExits.DocDate,
                    Comments: item.InventoryGenExits.Comments,
                    U_B2AG_PerformedArea: item.InventoryGenExits.U_B2AG_PerformedArea,
                    U_RDA: item.InventoryGenExits.U_RDA,
                    U_B2AG_Field: item["InventoryGenExits/DocumentLines"].U_B2AG_Field,
                    ItemCode: item["InventoryGenExits/DocumentLines"].ItemCode,
                    ItemDescription: item["InventoryGenExits/DocumentLines"].ItemDescription,
                    Quantity: item["InventoryGenExits/DocumentLines"].Quantity
                }
            })
            setData(mappedObject)
            setInitialLoad(false)
        }
        fetchData()
    }, [filters])

    function setField(field, newValue) {
        let newData = { ...filters }
        newData[field] = newValue
        setFilters(newData)
    }

    return (
        <>
            <PageHeader
                title={t["app.agricultural.operation-list"]}
            />
            <AgriculturalOperationListFilters
                filters={filters}
                setField={setField}
                setData={setData}
            />
            <br />
            <AgriculturalOperationGrid
                data={data}
            />
        </>
    )
}