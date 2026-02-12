import { useState } from 'react'
import {
    Drawer, IconButton, Divider
} from '@mui/material'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import { styled } from '@mui/material/styles'
import styles from './SideMenu.module.css'
import TreeViewMenu from './TreeViewMenu'

export default function SideMenu(props) {   
    
    const [expanded, setExpanded] = useState([])

    const handleClose = () => {
        props.setSidemenuOpen(false)
    }

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    }));

    return (
        <Drawer
            variant="temporary"
            anchor="left"
            open={props.sidemenuOpen}
            className={styles.drawer}
            classes={{
                paper: styles.drawer,
            }}
            onClose={() => {
                props.setSidemenuOpen(false)
            }}
        >
            <DrawerHeader>
                <IconButton onClick={handleClose} className={styles.icon}>
                    <ChevronLeft />
                </IconButton>
            </DrawerHeader>
            <Divider />
            <TreeViewMenu 
                expanded={expanded}
                setExpanded={setExpanded}
            />
        </Drawer>
    )
}