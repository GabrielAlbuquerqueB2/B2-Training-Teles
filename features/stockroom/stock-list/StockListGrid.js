import { Button } from '@mui/material'
import { useRouter} from 'next/router'
import { AgGridReact } from 'ag-grid-react'
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css'
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css'
import getTranslation from '../../../locales/getTranslation'
import getDatagridTranslation from '../../../locales/ag-grid/getDatagridTranslation'

export default function StockListGrid(props) {

    const t = getTranslation()
    const datagridTranslation = getDatagridTranslation()
    const router = useRouter()

   
    return (
        <>
            <div className='ag-theme-alpine' style={{ height: 535 }}>
                <AgGridReact                    
                    localeText={datagridTranslation}
                    rowData={props.data}
                    getRowId={props.data.DocNum}
                    pagination={true}
                    paginationPageSize={10}
                    defaultColDef={{ flex: 1, resizable: true, sortable: true, filter: true, autoSizeAll: true, editable: false }}
                    columnDefs={[
                        { headerName: 'Código', field: 'ItemCode' },        
                        { headerName: 'Descrição Item', field: 'ItemName' },                 
                        { headerName: 'Depósito', field: 'Warehouse' },                 
                        { headerName: 'Em Estoque', field: 'InStock' }     
                    ]}
                />

            </div>
        </>
    )
}