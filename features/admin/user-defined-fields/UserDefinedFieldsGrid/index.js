import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@mui/material'
import { AgGridReact } from 'ag-grid-react'
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css'
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css'
import getTranslation from '../../../../locales/getTranslation'
import getDatagridTranslation from '../../../../locales/ag-grid/getDatagridTranslation'
import { fetchTableData, getRowStyle, createField } from './UserDefinedFieldsGridServices'

function CreateButton(params) {

    return (
    <Button 
        id={params.data.id} 
        onClick={() => createField(params.data, params.api)}
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
        { headerName: 'Name', field: 'Name', flex: 1, resizable: true },
        { headerName: 'Description', field: 'Description', flex: 1, resizable: true },
        { headerName: 'TableName', field: 'TableName', flex: 1, resizable: true },
        { headerName: 'Type', field: 'Type', flex: 1, resizable: true },
        { headerName: 'SubType', field: 'SubType', flex: 1, resizable: true },
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
                    getRowId={props => props.data.Name + props.data.TableName}
                    getRowNodeId={(data) => {
                        return data.Name;
                    }}
                    defaultColDef={{ flex: 1, resizable: true, filter: true, autoSizeAll: true, editable: false }}
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