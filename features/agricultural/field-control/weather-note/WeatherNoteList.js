
import { Button } from '@mui/material'
import { useRouter } from 'next/router'
import { AgGridReact } from 'ag-grid-react'
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css'
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css'
import getTranslation from '../../../../locales/getTranslation'
import getDatagridTranslation from '../../../../locales/ag-grid/getDatagridTranslation'
import { getDateMonthYearFormat } from '../../../../utils/formatDate'

export default function WeatherNoteList(props) {

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

        if (params.data.Canceled === 'Y') {
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
                    router.push(`/agricultural/field-control/weather-note/${params.data.DocNum}`)
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
                            field: 'U_B2AG_RegisterDate',
                            valueFormatter: formatDate
                        },
                        { headerName: 'Posto', field: 'Name' },
                        { headerName: 'Unid. Produção', field: 'U_B2AG_ProductionUnitCode' },
                        {
                            headerName: 'Status',
                            field: 'Status',
                            cellRenderer: statusTranslate
                        },
                        { headerName: 'Elemento', field: 'U_B2AG_Element' },
                        { headerName: 'Valor', field: 'U_B2AG_Value' },
                        { headerName: 'Observações', field: 'U_B2AG_Comments' },
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