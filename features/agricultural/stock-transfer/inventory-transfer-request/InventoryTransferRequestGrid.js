import { useRouter } from 'next/router'
import { AgGridReact } from 'ag-grid-react'
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css'
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css'
import getTranslation from '../../../../locales/getTranslation'
import getDatagridTranslation from '../../../../locales/ag-grid/getDatagridTranslation'

export default function InventoryTransferRequestGrid(props) {

    const t = getTranslation()
    const datagridTranslation = getDatagridTranslation()
    const router = useRouter()

    function formatDate(params) {
        if (params.value) {
            const d = new Date(`${params.value} 00:00:00`)
            return Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(d)
        } else return ''
    }

    function redirectToDetail(props) {
        if (props.data.DocEntry)
            router.push(`/agricultural/stock-transfer/inventory-transfer-request/${props.data.DocEntry}`)
    }

    return (
        <>
            <div className='ag-theme-alpine' style={{ height: 730 }}>
                <AgGridReact
                    localeText={datagridTranslation}
                    rowData={props.data}
                    getRowId={props.data.DocEntry}
                    onRowDoubleClicked={redirectToDetail}
                    pagination={true}
                    paginationPageSize={15}
                    defaultColDef={{ flex: 1, resizable: true, sortable: true, filter: true, autoSizeAll: true, editable: false }}
                    columnDefs={[
                        { headerName: 'Código', field: 'DocNum' },
                        {
                            headerName: 'Data',
                            field: 'DocDate',
                            valueFormatter: formatDate
                        },
                        { headerName: 'Descrição Item', field: 'Item' },
                        { headerName: 'Filial', field: 'BPLName' },
                        { headerName: 'Depósito Origem', field: 'FromWarehouse' },
                        { headerName: 'Depósito Destino', field: 'ToWarehouse' },
                        { headerName: 'Observações', field: 'Comments' }
                    ]}
                />
            </div>
            <br />
        </>
    )
}