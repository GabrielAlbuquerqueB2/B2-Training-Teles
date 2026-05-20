import { Button } from '@mui/material'
import { useRouter } from 'next/router'
import { AgGridReact } from 'ag-grid-react'
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css'
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css'
import getDatagridTranslation from '../../../locales/ag-grid/getDatagridTranslation'

export default function BusinessPartnersList(props) {

    const datagridTranslation = getDatagridTranslation()
    const router = useRouter()

    function formatCpfCnpj(params) {
        if (!params.value) return ''
        const cleanValue = params.value.replace(/\D/g, '')
        if (cleanValue.length <= 11) {
            return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
        } else {
            return cleanValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
        }
    }
    
    function cardTypeTranslate(params) {
        switch (params.value) {
            case 'cCustomer': return 'Cliente'
            case 'cSupplier': return 'Fornecedor'
            case 'cLid': return 'Lead'
            default: return params.value
        }
    }

    function EditButton(params) {    
        return (
            <Button
                id={params.data.CardCode}
                onClick={() => {
                    router.push(`/business/partners/${params.data.CardCode}`)
                }}
            >
                Editar
            </Button>
        )
    }

    const rowData = Array.isArray(props.data) ? props.data : [];
    return (
        <>
            <div className='ag-theme-alpine' style={{ height: 730 }}>
                <AgGridReact
                    localeText={datagridTranslation}
                    rowData={rowData}
                    getRowId={params => params.data.CardCode}
                    pagination={true}
                    paginationPageSize={15}
                    defaultColDef={{ flex: 1, resizable: true, filter: true, autoSizeAll: true, editable: false }}
                    columnDefs={[ 
                        { headerName: 'Código', field: 'CardCode' },
                        { headerName: 'Nome / Razão Social', field: 'CardName' },
                        {
                            headerName: 'CPF/CNPJ',
                            field: 'FederalTaxID',
                            valueFormatter: formatCpfCnpj
                        },
                        { headerName: 'Telefone', field: 'Phone1' },
                        { headerName: 'Email', field: 'EmailAddress' },
                        {
                            headerName: 'Tipo',
                            field: 'CardType',
                            cellRenderer: cardTypeTranslate
                        },
                        {
                            headerName: 'Editar',
                            field: 'CardCode',
                            cellRenderer: EditButton,
                            resizable: true,
                            editable: false
                        }
                    ]}
                />
            </div>
            <br/>
        </>
    )
}