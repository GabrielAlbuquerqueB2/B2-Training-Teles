import React, { useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import ItemCellEditor from '../../components/ui/AgCellEditor/ItemCellEditor'


export default function Grid() {

  const [selectedValue, setSelectedValue] = useState({id: '', label: ''})

  const rowData = [
    { item: null },
    { item: null },
    { item: null },
    { item: null },
    { item: null },
  ];

  const [columnDefs] = useState([
    {
      headerName: "Item",
      field: "item",
      editable: true,
      cellEditor: ItemCellEditor,
      cellEditorPopup: true,
      resizable:true,
      cellEditorParams: {
        selectedValue: selectedValue,
        setSelectedValue: setSelectedValue
      }
    },

  ])

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}>
      </AgGridReact>
      <h1>Id: {selectedValue.id}</h1>
      <h1>Label: {selectedValue.label}</h1>
    </div>
  );
};