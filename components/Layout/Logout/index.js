import { useState, useEffect } from 'react'
import { Grid, Typography, Box, Menu, MenuItem } from '@mui/material'
import { useRouter } from 'next/router'
import { destroyCookie } from 'nookies'
import styles from './Logout.module.css'
import { getSessionData } from '../../../utils/frontEndGetSessionData'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import getTranslation from '../../../locales/getTranslation'

export default function Logout() {

    const router = useRouter()
    const [user, setUser] = useState('')
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const t = getTranslation()

    useEffect(() => {

        const sessionData = getSessionData()
        if (sessionData) {
            const userName = JSON.parse(sessionData).user
            setUser(userName)
        }
    }, [])

    function handleLogout() {

        destroyCookie({}, 'session', {
            path: '/',
        })
        sessionStorage.clear()
        router.push('/login')
    };

    function openMenu() {
        setMenuOpen(true)
    }

    return (

        <Grid container justify="flex-end">
            <Grid item>
                <Grid container direction="column" justify="center" alignItems="center">
                    <Grid item>
                        <Box 
                            className={styles.box}
                            onClick={handleClick}
                        >
                            <AccountCircleIcon fontSize="large" className={styles.accountIcon} />
                            <Typography variant="subtitle1" color="inherit" noWrap>
                                {user}
                            </Typography>
                        </Box>
                        <Menu                            
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                        >
                            {
                                user === 'manager' &&
                                <MenuItem
                                    onClick={() => {
                                        handleClose()
                                        router.push('/admin/user-defined-fields')
                                    }}
                                >
                                    {t["app.logout.menu.user-defined-fields"]}
                                </MenuItem>
                            }
                            <MenuItem
                                    onClick={() => {
                                        handleClose()
                                        router.push('/admin/change-password')
                                    }}
                                >
                                    {'Alterar Senha'}
                                </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    handleClose()
                                    handleLogout()
                                }}
                            >
                                {t["app.logout.submit.btn"]}
                            </MenuItem>
                        </Menu>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};