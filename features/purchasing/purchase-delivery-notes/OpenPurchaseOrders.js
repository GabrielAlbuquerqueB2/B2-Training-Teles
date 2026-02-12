
import { Button } from '@mui/material'
import { useRouter} from 'next/router'
import { AgGridReact } from 'ag-grid-react'
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css'
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css'
import getTranslation from '../../../locales/getTranslation'
import getDatagridTranslation from '../../../locales/ag-grid/getDatagridTranslation'

export default function OpenPurchaseOrdersGrid(props) {

    const t = getTranslation()
    const datagridTranslation = getDatagridTranslation()
    const router = useRouter()
    
    function formatDate(params) {
        if (params.value) {
            const d = new Date(params.value)
            return Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(d)
        } else return ''
    }   

    function EditButton(params) {    
        return (
            <Button
                id={params.data.id}
                onClick={() => {
                    router.push(`/purchasing/purchase-delivery-notes/${params.data.DocNum}`)
                }}
            >
                Selecionar
            </Button>
        )        
    }

    function typeTranslate(params) {

        if(params.data.ReserveInvoice === 'tYES') {
            return 'NF Rec.Futuro'
        } else {
            return 'Pedido de Compras'
        } 
    }

    return (
        <>
            <div className='ag-theme-alpine' style={{ height: 535 }}>
                <AgGridReact                    
                    localeText={datagridTranslation}                   
                    rowData={props.data}
                    getRowId={props.data.DocNum}
                    pagination={true}
                    paginationPageSize={10}
                    defaultColDef={{ flex: 1, resizable: true, filter: true, autoSizeAll: true, editable: true }}
                    columnDefs={[
                        { 
                            headerName: 'Tipo', 
                            field: 'ReserveInvoice',
                            cellRenderer: typeTranslate
                        },   
                        { headerName: 'Código', field: 'DocNum' }, 
                        {
                            headerName: 'Selecionar',
                            field: 'DocNum',
                            cellRenderer: EditButton,
                            resizable: true,
                            editable: false
                        },           
                        { headerName: 'Nº Ped. Fornec.', field: 'ImportFileNum' }, 
                        {
                            headerName: 'Data',
                            field: 'DocDate',
                            valueFormatter: formatDate
                        },              
                        { headerName: 'Fornecedor', field: 'CardName' },                 
                        { 
                            headerName: 'Valor R$', 
                            field: 'DocTotal',
                            cellStyle: { textAlign: 'right' }
                        }, 
                        { headerName: 'Filial', field: 'BPLName' }, 
                        { headerName: 'Observações', field: 'Comments' }
                    ]}
                />

            </div>
        </>
    )
}