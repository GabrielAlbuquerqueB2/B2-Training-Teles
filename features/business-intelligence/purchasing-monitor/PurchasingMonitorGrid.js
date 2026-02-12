import React, { useEffect, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css'
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css'
import getTranslation from '../../../locales/getTranslation'
import getDatagridTranslation from '../../../locales/ag-grid/getDatagridTranslation'
import { getPurchasingMonitor } from './PurchasingMonitorServices'
import { getDateMonthYearFormat } from '../../../utils/formatDate'


export default function PurchasingMonitorGrid() {
    const t = getTranslation()
    const [data, setData] = useState([])
    const [gridApi, setGridApi] = useState(null);
    const datagridTranslation = getDatagridTranslation()
    const columnDefs = [
        { headerName: 'Codigo', field: 'Codigo', flex: 1, resizable: true },
        { headerName: 'Data', field: 'Data', flex: 1, resizable: true, valueFormatter: formatDate },
        { headerName: 'Hora', field: 'Hora', flex: 1, resizable: true },
        { headerName: 'Dias em Aberto', field: 'DiasEmAberto', flex: 1, align: 'center', resizable: true },
        { headerName: 'Solicitante', field: 'Solicitante', flex: 1, resizable: true },
        { headerName: 'Equipamento', field: 'Equipamento', flex: 1, resizable: true },
        { headerName: 'Status', field: 'Status', flex: 1, resizable: true }
    ]

    function formatDate(params) {
        if (params.value) {
            const d = getDateMonthYearFormat(params.value)
            return d
        } else return ''
    }

    useEffect(() => {

       setInterval(() => {
            const fetchData = async () => {
                const result = await getPurchasingMonitor()
                setData(result)
            }
            fetchData()
        }, 3000) 
    }, [])
  
    function getRowStyle(params) {
        if (params.data.Status === 'Novo') {
            return { background: '#33FF3F' };
        }
    }

    function onGridReady(params) {
        setGridApi(params.api)
    }

    return (
        <>
        <div className='ag-theme-alpine' style={{ height: 700 }}>
            <AgGridReact
                localeText={datagridTranslation}
                rowData={data}
                pagination={true}
                getRowStyle={getRowStyle}
                paginationPageSize={14}
                columnDefs={columnDefs}
                onGridReady={onGridReady}
            />
        </div>
        </>
    )

}