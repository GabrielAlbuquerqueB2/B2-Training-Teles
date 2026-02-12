import { Snackbar, IconButton, Alert } from '@mui/material'

export default function AlertMessage(props) {

    function handleClose() {
        props.setAlertOpen({ visible: false, type: '', message: '' })
    }

    return (
        <>
            <Snackbar
                open={props.alertOpen}
                onClose={handleClose}
                severity={props.type}
            >
                <Alert                    
                    onClose={handleClose}
                    severity={props.type || "info"}
                >
                    {props.message}
                </Alert>
            </Snackbar>
        </>
    )

}