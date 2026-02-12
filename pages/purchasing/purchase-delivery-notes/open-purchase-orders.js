import { useState, useEffect } from 'react'
import PageHeader from '../../../components/ui/PageHeader'
import getTranslation from '../../../locales/getTranslation'
import OpenPurchaseOrdersGrid from '../../../features/purchasing/purchase-delivery-notes/OpenPurchaseOrders'
import { getOpenPurchaseOrdersAndApReserveInvoices } from '../../../features/purchasing/purchase-delivery-notes/PurchaseDeliveryNotesServices'


export default function PurchaseRequestGrid() {

    const t = getTranslation()
    const [data, setData] = useState([])

    useEffect(() => {
        async function fetchData() {
            const docs = await getOpenPurchaseOrdersAndApReserveInvoices()
            setData(docs)
        }
        fetchData()
    }, [])

    return (
        <>
            <PageHeader
                title={'Selecione um Pedido de Compras ou Nota Fiscal de Recebimento Futuro para receber as mercadorias:'}
            />
            <OpenPurchaseOrdersGrid
                data={data}
            />
        </>
    )
}