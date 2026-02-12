import TransferPurchaseDeliveryNotesHeader from './TransferPurchaseDeliveryNotesHeader'
import TransferPurchaseDeliveryNotesItems from './TransferPurchaseDeliveryNotesItems'
import TransferPurchaseDeliveryNotesActions from './TransferPurchaseDeliveryNotesActions'

export default function TransferPurchaseDeliveryNotesGeneralData(props) {

    return (
        <>
            <TransferPurchaseDeliveryNotesHeader
                data={props.data}
                setField={props.setField}               
                deliveryNote={props.deliveryNote}
                setDeliveryNote={props.setDeliveryNote}
                deliveryNotesList={props.deliveryNotesList}
            />
            <TransferPurchaseDeliveryNotesItems
                data={props.data}
                setChildField={props.setChildField}
            />
            <br />
            <TransferPurchaseDeliveryNotesActions
                data={props.data}                
                deliveryNote={props.deliveryNote}
                setAlert={props.setAlert}
            />
        </>
    )
}