import { Button } from '@mui/material'
import { useRouter} from 'next/router'
import { AgGridReact } from 'ag-grid-react'
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css'
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css'
import getTranslation from '../../../../locales/getTranslation'
import getDatagridTranslation from '../../../../locales/ag-grid/getDatagridTranslation'

export default function TransferPurchaseDeliveryNotesGrid(props) {

    const t = getTranslation()
    const datagridTranslation = getDatagridTranslation()
    const router = useRouter()

    function formatDate(params) {
        if (params.value) {
            const d = new Date(`${params.value.substr(0, 10)} 00:00:00`)
            return Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(d)
        } else return ''
    }    


    function SaveButton(params) {    
        return (
            <Button
                id={params.data.id}
                onClick={() => {
                    router.push(`/agricultural/stock-transfer/transfer-purchase-delivery-notes/${params.data.DocEntry}`)
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
                        { headerName: 'Código', field: 'DocEntry' }, 
                        {
                            headerName: 'Data',
                            field: 'U_B2AG_Date',
                            valueFormatter: formatDate
                        },              
                        { headerName: 'Filial Origem', field: 'U_B2AG_OriginBranch' },                 
                        { headerName: 'Filial Destino', field: 'U_B2AG_DestinationBranch' },  
                        { headerName: 'Descrição', field: 'U_B2AG_Description' },  
                        {
                            headerName: 'Editar',
                            field: 'DocEntry',
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