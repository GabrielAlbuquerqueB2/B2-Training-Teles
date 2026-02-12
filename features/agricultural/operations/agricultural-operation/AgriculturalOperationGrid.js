import { Button } from '@mui/material'
import { useRouter} from 'next/router'
import { AgGridReact } from 'ag-grid-react'
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css'
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css'
import getTranslation from '../../../../locales/getTranslation'
import getDatagridTranslation from '../../../../locales/ag-grid/getDatagridTranslation'
import { getDateMonthYearFormat } from '../../../../utils/formatDate'

export default function AgriculturalOperationGrid(props) {

    const t = getTranslation()
    const datagridTranslation = getDatagridTranslation()
    const router = useRouter()

    function formatDate(params) {
        if (params.value) {
            const d = getDateMonthYearFormat(params.value)
            return d
        } else return ''
    }   

    function DetailsButton(params) {    
        return (
            <Button
                id={params.data.id}
                onClick={() => {
                    router.push(`/agricultural/operation/${params.data.DocEntry}`)
                }}
            >
                Visualizar
            </Button>
        )
    }
    
    return (
        <>
            <div className='ag-theme-alpine' style={{ height: 730 }}>
                <AgGridReact                    
                    localeText={datagridTranslation}
                    rowData={props.data}
                    getRowId={props.data.DocEntry}
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
                        { headerName: 'Quantidade', field: 'Quantity' },               
                        { headerName: 'Item', field: 'ItemDescription' },                 
                        { headerName: 'Talhão', field: 'U_B2AG_Field' },                 
                        { headerName: 'Área Realizada', field: 'U_B2AG_PerformedArea' },                
                        { headerName: 'RDA', field: 'U_RDA' },                
                        { headerName: 'Observação', field: 'Comments' },               
                        {
                            headerName: 'Visualizar',
                            field: 'DocNum',
                            cellRenderer: DetailsButton,
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