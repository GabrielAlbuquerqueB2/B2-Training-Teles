import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AppBar, IconButton, Toolbar, Typography, Button, Box } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Logout from '../Logout'
import StorageIcon from '@mui/icons-material/Storage'
import styles from './Navbar.module.css'
import { getSessionData } from '../../../utils/frontEndGetSessionData'

export default function Navbar(props) {

    const [currentCompanyName, setCurrentCompanyName] = useState('')

    useEffect(() => {

        const sessionData = getSessionData()
        if (sessionData) {
            const companyName = JSON.parse(sessionData).CompanyName
            setCurrentCompanyName(companyName.toUpperCase())
        }
    }, [])

    return (
        <AppBar className={styles.appbar}>
            <Toolbar className={styles.toolbar}>
                <Box className={styles.box}>
                    <IconButton
                        className={styles.menuIcon}
                        onClick={() => {
                            props.setSidemenuOpen(true)
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Link href="/home" passHref legacyBehavior>
                        <div>
                            <Image
                                src="/images/sapb1logo.png"
                                width="146"
                                height="47"
                                alt="Logo"
                                className={styles.logo}
                            />
                        </div>
                    </Link>
                </Box>
                <Box className={styles.box}>
                    <StorageIcon className={styles.menuIcon} />
                    <Typography variant="overline">{currentCompanyName}</Typography>
                </Box>
                <Box className={styles.box}>
                    <Logout />
                </Box>
            </Toolbar>
        </AppBar>
    )
}