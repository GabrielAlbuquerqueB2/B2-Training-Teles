import { useEffect, useState, useMemo } from 'react'
import { Box, Snackbar, Alert } from '@mui/material'
import AddressSection from './components/AddressSection'
import BusinessIcon from '@mui/icons-material/Business'
import LocationOnIcon from '@mui/icons-material/LocationOn'

export default function BusinessPartnersAddresses(props) {
    const addresses = props.data.BPAddresses || [];
    const [alertMessage, setAlertMessage] = useState('');
    const [expandedAddress, setExpandedAddress] = useState(null);

    useEffect(() => {
        if (props.onMount) {
            props.onMount();
        }
    }, []);

    const { billToAddresses, shipToAddresses } = useMemo(() => {
        const billTo = [];
        const shipTo = [];
        
        addresses.forEach((addr, index) => {
            const addressWithIndex = { ...addr, originalIndex: index };
            if (addr.AddressType === 'bo_BillTo') {
                billTo.push(addressWithIndex);
            } else if (addr.AddressType === 'bo_ShipTo') {
                shipTo.push(addressWithIndex);
            }
        });
        
        return { billToAddresses: billTo, shipToAddresses: shipTo };
    }, [addresses]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AddressSection
                addresses={billToAddresses}
                type="Cobrança"
                icon={<BusinessIcon color="primary" sx={{ mr: 1, fontSize: '1.2rem' }} />}
                title="Endereços de Cobrança"
                keyPrefix="bill"
                expandedAddress={expandedAddress}
                setExpandedAddress={setExpandedAddress}
                setAddressField={props.setChildField}
                handleDeleteAddress={props.handleDeleteAddress}
                setAlertMessage={setAlertMessage}
                showTaxId={false}
            />
            <AddressSection
                addresses={shipToAddresses}
                type="Entrega"
                icon={<LocationOnIcon color="success" sx={{ mr: 1, fontSize: '1.2rem' }} />}
                title="Endereços de Entrega"
                keyPrefix="ship"
                expandedAddress={expandedAddress}
                setExpandedAddress={setExpandedAddress}
                setAddressField={props.setChildField}
                handleDeleteAddress={props.handleDeleteAddress}
                setAlertMessage={setAlertMessage}
                showTaxId={true}
            />
            <Snackbar
                open={!!alertMessage}
                autoHideDuration={4000}
                onClose={() => setAlertMessage('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setAlertMessage('')}
                    severity="error"
                    variant="filled"
                >
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}