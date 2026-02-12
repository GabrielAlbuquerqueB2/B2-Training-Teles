import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AgGridReact } from 'ag-grid-react';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css';
import getDatagridTranslation from '../../locales/ag-grid/getDatagridTranslation';
import { getDateMonthYearFormat } from '../../utils/formatDate';
import { getDraftById } from './ApprovalRequestsServices';
import ApprovalRequestsModal from './ApprovalRequestsModal';

export default function ApprovalRequestsGrid(props) {

    const datagridTranslation = getDatagridTranslation();
    const router = useRouter();
    const gridRef = useRef(null); // Create a reference to the AgGridReact instance

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [rowData, setRowData] = useState(props.data); // Novo estado local para os dados

    // Atualize rowData se props.data mudar (opcional)
    useEffect(() => { setRowData(props.data); }, [props.data]);

    function formatDate(params) {
        if (params.value) {
            return getDateMonthYearFormat(params.value);
        } else return '';
    }

    // Mapeamento de status
    function mapStatus(params) {
        switch (params.value) {
            case -2: return 'Não Iniciado';
            case 1: return 'Em Andamento';
            case -3: return 'Concluído';
        }
    }

    const onRowDoubleClicked = async (event) => {
        const draftData = await getDraftById(event.data.DraftEntry);
        setSelectedItem({ ...draftData, Code: event.data.Code });
        setModalOpen(true);
    };

    function getRowStyle(params) {
        const today = new Date();
        const startDate = params.data.StartDate ? new Date(params.data.StartDate) : null;
        const endDueDate = params.data.EndDueDate ? new Date(params.data.EndDueDate) : null;
        const status = params.data.Status ? params.data.Status : null;

        if (!startDate) return {};

        // Se StartDate for maior que hoje, não colorir
        if (startDate > today) {
            return {};
        }

        // Se hoje >= EndDueDate, vermelho
        if (endDueDate && today >= endDueDate && status !== -3) {
            return { background: '#ff6c37' }; // vermelho escuro
        }

        // Se hoje > StartDate e hoje < EndDueDate, amarelo
        if (endDueDate && today > startDate && today < endDueDate && status !== -3) {
            return { background: '#ffca28' }; // amarelo
        }

        // Se hoje > StartDate e hoje < EndDueDate, amarelo
        if (status && status === -3) {
            return { background: '#529949' }; // amarelo
        }

        return {};
    }

    return (
        <>
            <div className='ag-theme-alpine' style={{ height: 690 }}>
                <AgGridReact
                    ref={gridRef}
                    localeText={datagridTranslation}
                    rowData={rowData}
                    getRowId={params => params.data.Code}
                    onRowDoubleClicked={onRowDoubleClicked}
                    //getRowStyle={getRowStyle}
                    pagination={true}
                    paginationPageSize={14}
                    defaultColDef={{
                        flex: 1,
                        resizable: true,
                        filter: true,
                        autoSizeAll: true,
                        editable: false
                    }}
                    columnDefs={[
                        { headerName: 'Código', field: 'Code' },
                        { headerName: 'Solicitante', field: 'OriginatorName' },
                        { headerName: 'Data', field: 'CreationDate', valueFormatter: formatDate },
                        { headerName: 'Documento', field: 'ObjectType' },
                        { headerName: 'Status', field: 'Status', valueFormatter: mapStatus },
                        {
                            headerName: 'Observações',
                            field: 'Remarks',
                            tooltipField: 'Remarks',
                            width: 200,
                            cellStyle: {
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }
                        },
                    ]}
                />
            </div>
            <ApprovalRequestsModal open={modalOpen} onClose={() => setModalOpen(false)} draft={selectedItem} setAlert={props.setAlert} />
            <br />
        </>
    )
}