import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@mui/material'
import { AgGridReact } from 'ag-grid-react'
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css'
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css'
import getTranslation from '../../../../locales/getTranslation'
import getDatagridTranslation from '../../../../locales/ag-grid/getDatagridTranslation'
import { fetchTableData, getRowStyle, createTable } from './UserDefinedTablesGridServices'

function CreateButton(params) {

    return (
    <Button 
        id={params.data.id} 
        onClick={() => createTable(params.data, params.api)}
    >
        Criar
    </Button>
    )
}

export default function UserDefinedFieldsGrid(props) {

    const t = getTranslation()
    const gridRef = useRef()
    const [gridApi, setGridApi] = useState(null);
    const datagridTranslation = getDatagridTranslation()

    const columnDefs = [
        { headerName: 'TableName', field: 'TableName', flex: 1, resizable: true },
        { headerName: 'TableDescription', field: 'TableDescription', flex: 1, resizable: true },
        { headerName: 'TableType', field: 'TableType', flex: 1, resizable: true },
        { headerName: 'NeedToCreate', field: 'NeedToCreate', flex: 1, resizable: true, hide: true },
        {
            headerName: "Create",
            field: 'Name',
            cellRenderer: CreateButton,   
            resizable: true,                               
        }
    ]

    function onGridReady(params) {
        setGridApi(params.api)
    }

    return (
        <>
            <div className='ag-theme-alpine' style={{ height: 535 }}>
                <AgGridReact
                    ref={gridRef}
                    localeText={datagridTranslation}
                    rowData={props.data}
                    rowSelection='multiple'
                    getRowId={props.data.TableName}
                    getRowNodeId={(data) => {
                        return data.TableName;
                    }}
                    pagination={false}
                    columnDefs={columnDefs}
                    getRowStyle={getRowStyle}
                    onGridReady={onGridReady}
                />

            </div>
            <br />
            <Button
                onClick={() => { fetchTableData(gridApi) }}
            >
                Validar
            </Button>
        </>
    )
}