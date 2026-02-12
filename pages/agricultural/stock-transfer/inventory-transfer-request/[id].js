import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import getTranslation from '../../../../locales/getTranslation'
import { Grid, Box, TextField } from '@mui/material'
import PageHeader from '../../../../components/ui/PageHeader'
import InventoryTransferRequestHeader from '../../../../features/agricultural/stock-transfer/inventory-transfer-request/InventoryTransferRequestHeader'
import InventoryTransferRequestItems from '../../../../features/agricultural/stock-transfer/inventory-transfer-request/InventoryTransferRequestItems'
import InventoryTransferRequestActions from '../../../../features/agricultural/stock-transfer/inventory-transfer-request/InventoryTransferRequestActions'
import { getInventoryTransferRequestById } from '../../../../features/agricultural/stock-transfer/inventory-transfer-request/InventoryTransferRequestServices'
import { getWarehousesByUserBranch } from '../../../../utils/getUserLocationsByAssignment'
import { getYearMonthDateFormat } from '../../../../utils/formatDate'

export default function InventoryTransferRequest() {

    const router = useRouter()
    const id = router.query.id
    const t = getTranslation()

    const [data, setData] = useState({ StockTransferLines: [{ ItemCode: '', Quantity: 0 }] })
    const [warehousesList, setWarehousesList] = useState([])
    const [isClosed, setIsClosed] = useState(false)
    const [formMode, setFormMode] = useState({ mode: 'CREATE', buttonLabel: 'ADICIONAR' })

    useEffect(() => {
        if (id !== 'new' && id) {
            async function fetchData() {
                setFormMode({ mode: 'UPDATE', buttonLabel: 'ATUALIZAR' })
                const result = await getInventoryTransferRequestById(id)  
                if(result.DocumentStatus === 'bost_Close') {
                    setIsClosed(true)
                }              
                const mappedItems = mapItems(result)
                setData({
                    ...result,
                    DocDate: getYearMonthDateFormat(result.DocDate),
                    StockTransferLines: mappedItems
                })
            }
            fetchData()
        }
    }, [id])

    function mapItems(items) {
        const result = items.StockTransferLines.map(item => {   
           return {
                ItemCode: item.ItemCode,
                Quantity: item.Quantity,
                LineNum: item.LineNum,
                Item: {
                    id: item.ItemCode,
                    label: item.ItemDescription,
                    InventoryUOM: item.UoMCode
                }          
            }            
        })

        return [{ ItemCode: '', Quantity: 0 }, ...result]
    }

    useEffect(() => {
        if (data.BPLID) {
            const warehouses = getWarehousesByUserBranch(data.BPLID).map(branch => {
                return { value: branch.WarehouseCode, description: `${branch.WarehouseCode} - ${branch.WarehouseName}` }
            })
            setWarehousesList(warehouses)
        }
    }, [data.BPLID])

    function setField(field, newValue) {
        let newData = { ...data }
        newData[field] = newValue
        setData(newData)
    }

    function setChildField(father, field, index, newValue) {
        let newData = { ...data }
        newData[father][index][field] = newValue
        setData(newData)
    }

    function handleNewLine() {
        let newData = { ...data }
        newData.StockTransferLines.push({ Item: '' })
        setData(newData)
    }

    function handleDeleteLine(index) {
        if (data.StockTransferLines.length <= 1) return;
        let newData = { ...data }
        newData.StockTransferLines.splice(index, 1)
        setData(newData)
    }

    return (
        <>
            <PageHeader
                title={t["app.sidenav.inventory-transfer-request"]}
            />
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <InventoryTransferRequestHeader
                            data={data}
                            setField={setField}
                            warehousesList={warehousesList}
                            isClosed={isClosed}
                            formMode={formMode}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InventoryTransferRequestItems
                            data={data}
                            setChildField={setChildField}
                            handleNewLine={handleNewLine}
                            handleDeleteLine={handleDeleteLine}
                            isClosed={isClosed}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Observações"
                            multiline
                            rows={3}
                            value={data.Comments ?? ''}
                            onChange={(evt) => setField('Comments', evt.target.value)}
                            disabled={isClosed}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InventoryTransferRequestActions
                            data={data}
                            router={router}
                            isClosed={isClosed}
                            formMode={formMode}
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}