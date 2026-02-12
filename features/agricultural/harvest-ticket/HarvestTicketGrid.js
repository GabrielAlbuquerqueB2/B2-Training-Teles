import { Button } from '@mui/material'
import { useRouter} from 'next/router'
import { AgGridReact } from 'ag-grid-react'
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css'
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css'
import getTranslation from '../../../locales/getTranslation'
import getDatagridTranslation from '../../../locales/ag-grid/getDatagridTranslation'

export default function HarvestTicketGrid(props) {

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
                    router.push(`/agricultural/harvest-ticket/${params.data.DocNum}`)
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
                        { headerName: 'CCG', field: 'U_B2AG_CCG' }, 
                        {
                            headerName: 'Data',
                            field: 'U_B2AG_Date',
                            valueFormatter: formatDate
                        },              
                        { headerName: 'Ticket', field: 'U_B2AG_TicketNumber' },                 
                        { headerName: 'Cultura', field: 'Name' },                 
                        { headerName: 'Peso Bruto', field: 'U_B2AG_GrossWeight'},                 
                        { headerName: 'Peso Liquido', field: 'U_B2AG_LiquidWeight' },                 
                        { headerName: 'Motorista', field: 'U_B2AG_Driver' },                 
                        { headerName: 'Placa', field: 'U_B2AG_LicensePlate' },                 
                        { 
                            headerName: 'Status', 
                            field: 'Status',
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