import { Accordion, AccordionSummary, AccordionDetails, Box, Typography, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddressForm from './AddressForm';

export default function AddressCard({
    address,
    type,
    uniqueKey,
    expandedAddress,
    setExpandedAddress,
    setAddressField,
    handleDeleteAddress,
    setAlertMessage,
    showTaxId,
    canDelete
}) {
    
    const getAddressSummary = () => {
        const parts = [];
        if (address.Street) parts.push(address.Street);
        if (address.StreetNo) parts.push(address.StreetNo);
        if (address.Block) parts.push(address.Block);
        if (address.City) parts.push(address.City);
        const countyValue = typeof address.County === 'string' ? address.County : address.County?.SAPCode;
        if (countyValue) parts.push(countyValue);
        if (address.State) parts.push(address.State);
        
        return parts.length > 0 ? parts.join(', ') : 'Endereço não preenchido';
    };

    const handleAccordionChange = (event, isExpanded) => {
        setExpandedAddress(isExpanded ? uniqueKey : null);
    };

    return (
        <Accordion
            expanded={expandedAddress === uniqueKey}
            onChange={handleAccordionChange}
            sx={{ 
                mb: 2, 
                border: '1px solid #e0e0e0', 
                borderRadius: 2,
                boxShadow: 'none',
                backgroundColor: '#ebf0f3',
                '&:before': { display: 'none' },
                '&.Mui-expanded': { margin: '0 0 16px 0' }
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                    '& .MuiAccordionSummary-content': { 
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    },
                    minHeight: '56px',
                    '&.Mui-expanded': { minHeight: '56px' }
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {address.AddressName || `${type} ${address.originalIndex + 1}`}
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ flex: 1, ml: 2 }}>
                    {getAddressSummary()}
                </Typography>
                {canDelete && (
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(address.originalIndex);
                        }}
                        sx={{ ml: 2 }}
                    >
                        <DeleteIcon fontSize="small" />
                    </Button>
                )}
            </AccordionSummary>
            
            <AccordionDetails sx={{ pt: 1, pb: 2 }}>
                <AddressForm
                    address={address}
                    setAddressField={setAddressField}
                    setAlertMessage={setAlertMessage}
                    showTaxId={showTaxId}
                />
            </AccordionDetails>
        </Accordion>
    );
}
