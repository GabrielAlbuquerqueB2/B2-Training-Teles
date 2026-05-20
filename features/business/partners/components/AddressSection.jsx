import { Box, Typography } from '@mui/material';
import AddressCard from './AddressCard';

export default function AddressSection({
    addresses,
    type,
    icon,
    title,
    keyPrefix,
    expandedAddress,
    setExpandedAddress,
    setAddressField,
    handleDeleteAddress,
    setAlertMessage,
    showTaxId
}) {
    if (addresses.length === 0) return null;
    
    return (
        <Box sx={{ flexGrow: 1, mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {icon}
                <Typography variant="h6" component="div" sx={{ color: 'text.primary', fontWeight: 500 }}>
                    {title}
                </Typography>
            </Box>
            
            {addresses.map((address) => {
                const uniqueKey = `${keyPrefix}-${address.originalIndex}`;
                
                return (
                    <AddressCard
                        key={uniqueKey}
                        address={address}
                        type={type}
                        uniqueKey={uniqueKey}
                        expandedAddress={expandedAddress}
                        setExpandedAddress={setExpandedAddress}
                        setAddressField={setAddressField}
                        handleDeleteAddress={handleDeleteAddress}
                        setAlertMessage={setAlertMessage}
                        showTaxId={showTaxId}
                        canDelete={addresses.length > 2}
                    />
                );
            })}
        </Box>
    );
}
