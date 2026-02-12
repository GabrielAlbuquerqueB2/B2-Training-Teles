import { Button } from '@mui/material'
import { useRouter} from 'next/router'
import { AgGridReact } from 'ag-grid-react'
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css'
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css'
import getTranslation from '../../../locales/getTranslation'
import getDatagridTranslation from '../../../locales/ag-grid/getDatagridTranslation'
import { getDateMonthYearFormat } from '../../../utils/formatDate'

export default function PurchaseRequestList(props) {

    const t = getTranslation()
    const datagridTranslation = getDatagridTranslation()
    const router = useRouter()

    function formatDate(params) {
        if (params.value) {
            const d = getDateMonthYearFormat(params.value)
            return d
        } else return ''
    }
    
    function statusTranslate(params) {

        if(params.data.Cancelled === 'tYES') {
            return 'Cancelado'
        } else {

            switch (params.value) {
                case 'bost_Open': return 'Aberto'
                case 'bost_Close': return 'Encerrado'
            }
        } 
        
        return ''
    }

    function SaveButton(params) {    
        return (
            <Button
                id={params.data.id}
                onClick={() => {
                    router.push(`/purchasing/purchase-request/${params.data.DocNum}`)
                }}
            >
                Editar
            </Button>
        )
    
    
    }

    return (
        <>
            <div className='ag-theme-alpine' style={{ height: 730 }}>
                <AgGridReact                    
                    localeText={datagridTranslation}
                    rowData={props.data}
                    getRowId={props.data.DocNum}
                    pagination={true}
                    paginationPageSize={15}
                    defaultColDef={{ flex: 1, resizable: true, filter: true, autoSizeAll: true, editable: false }}
                    columnDefs={[
                        { headerName: 'Código', field: 'DocNum' }, 
                        {
                            headerName: 'Data',
                            field: 'DocDate',
                            valueFormatter: formatDate
                        },              
                        { headerName: 'NF', field: 'U_TX_NDfe' },                 
                        { headerName: 'Observação', field: 'Comments' },
                        { 
                            headerName: 'Status', 
                            field: 'DocumentStatus',
                            cellRenderer: statusTranslate
                        },   
                        {
                            headerName: 'Editar',
                            field: 'DocNum',
                            cellRenderer: SaveButton,
                            resizable: true,
                            editable: false
                        }            
                    ]}
                />

            </div>
            <br />
        </>
    )
}