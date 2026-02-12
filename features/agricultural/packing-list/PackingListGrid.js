import { Button } from '@mui/material'
import { useRouter} from 'next/router'
import { AgGridReact } from 'ag-grid-react'
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css'
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css'
import getTranslation from '../../../locales/getTranslation'
import getDatagridTranslation from '../../../locales/ag-grid/getDatagridTranslation'

export default function PackingListGrid(props) {

    const t = getTranslation()
    const datagridTranslation = getDatagridTranslation()
    const router = useRouter()

    function formatDate(params) {
        if (params.value) {
            const d = new Date(`${params.value} 00:00:00`)
            return Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(d)
        } else return ''
    }
    
    function statusTranslate(params) {

        if(params.data.Canceled === 'Y') {
            return 'Cancelado'
        } else {

            switch (params.value) {
                case 'O': return 'Aberto'
                case 'C': return 'Encerrado'
            }
        } 
        
        return ''
    }

    function SaveButton(params) {    
        return (
            <Button
                id={params.data.id}
                onClick={() => {
                    router.push(`/agricultural/packing-list/${params.data.DocEntry}`)
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
                        { headerName: 'Item', field: 'ItemDescription' },                 
                        { headerName: 'Peso Liquido', field: 'U_B2AG_LiquidWeight' },                 
                        { headerName: 'Cliente', field: 'CardName' },                  
                        { headerName: 'Placa', field: 'U_B2AG_LicensePlate' },                  
                        { headerName: 'Motorista', field: 'U_B2AG_Driver' },                  
                        { 
                            headerName: 'Status', 
                            field: 'Status',
                            cellRenderer: statusTranslate
                        },   
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