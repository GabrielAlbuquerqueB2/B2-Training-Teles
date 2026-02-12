import TransferDeliveryNotesHeader from './TransferDeliveryNotesHeader'
import TransferDeliveryNotesItems from './TransferDeliveryNotesItems'
import TransferDeliveryNotesActions from './TransferDeliveryNotesActions'

export default function TransferDeliveryNotesGeneralData(props) {

    return (
        <>
            <TransferDeliveryNotesHeader
                data={props.data}
                setField={props.setField}
                shipping={props.shipping}
                setShipping={props.setShipping}
            />
            <TransferDeliveryNotesItems
                data={props.data}
                setField={props.setField}
                setChildField={props.setChildField}
            />
            <br />
            <TransferDeliveryNotesActions
                data={props.data}
                shipping={props.shipping}
                setAlert={props.setAlert}
            />
        </>
    )
}