import { Button } from '@mui/material'
import { useRouter} from 'next/router'
import { AgGridReact } from 'ag-grid-react'
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css'
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css'
import getTranslation from '../../../locales/getTranslation'
import getDatagridTranslation from '../../../locales/ag-grid/getDatagridTranslation'
import { getDateMonthYearFormat } from '../../../utils/formatDate'

export default function FuelAndLubrificationGridGrid(props) {

    const t = getTranslation()
    const datagridTranslation = getDatagridTranslation()
    const router = useRouter()

    function formatDate(params) {
        if (params.value) {
            const d = getDateMonthYearFormat(params.value)
            return d
        } else return ''
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
                        { headerName: 'Item', field: 'ItemDescription' },                 
                        { headerName: 'Quantidade', field: 'Quantity' },                 
                        { headerName: 'Equipamento', field: 'U_B2AG_Equipment' },                 
                        { headerName: 'Odômetro', field: 'U_B2AG_Odometer' },                
                        { headerName: 'Operador', field: 'U_B2AG_Operator' },                
                        { headerName: 'Observação', field: 'Comments'}          
                    ]}
                />
            </div>
            <br />
        </>
    )
}