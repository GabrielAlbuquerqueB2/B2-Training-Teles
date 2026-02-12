import { useState } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

export default function WarehouseExitCopyFrom(props) {

    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    function handleClose() {
        setAnchorEl(null)
    }

    function handleInventoryEntriesClick() {
        props.setIsDialogOpen(true)
        handleClose()
    }

    return (
        <>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                disabled={!props.data.ProductionUnitCode}
            >
                Copiar De
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleInventoryEntriesClick}>Recebimento de Mercadoria</MenuItem>
            </Menu>
        </>
    )
}