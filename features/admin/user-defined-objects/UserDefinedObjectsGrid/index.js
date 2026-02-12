import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@mui/material'
import { AgGridReact } from 'ag-grid-react'
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css'
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css'
import getTranslation from '../../../../locales/getTranslation'
import getDatagridTranslation from '../../../../locales/ag-grid/getDatagridTranslation'
import { fetchTableData, getRowStyle, createObject } from './UserDefinedObjectsGridServices'

function CreateButton(params) {

    return (
    <Button 
        id={params.data.id} 
        onClick={() => createObject(params.data, params.api)}
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
        { headerName: 'Code', field: 'Code', flex: 1, resizable: true },
        { headerName: 'Name', field: 'Name', flex: 1, resizable: true },
        { headerName: 'TableName', field: 'TableName', flex: 1, resizable: true },
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
                    getRowId={props.data.Code}
                    getRowNodeId={(data) => {
                        return data.Code;
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