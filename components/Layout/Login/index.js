import { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { TextField, Grid, Button, InputAdornment, Box, LinearProgress } from '@mui/material'
import { AccountCircle, LockRounded } from '@mui/icons-material'
import styles from './Login.module.css'
import axios from 'axios'
import AlertMessage from '../../ui/AlertMessage'
import getTranslation from '../../../locales/getTranslation'
import { getSessionData } from '../../../utils/frontEndGetSessionData'
import { getBranchesByUserKey, mapBranchesCodesToNames, getPermissionsByUserKey, getB2AgriParameters } from './LoginService'

export default function Login() {

    const router = useRouter()

    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')

    const [progressBarHidden, setProgressBarHidden] = useState(true)
    const [alert, setAlert] = useState({ visible: false, type: "", message: '' })

    const t = getTranslation()

    const handleLogin = async () => {
        setProgressBarHidden(false)

        try {

            await axios.post('/api/login', {
                user: user,
                password: password
            })
            await handleUserDataFetch()
            router.push('/home')
        } catch (err) {
            console.log(err)
            if (err.response) {
                setAlert({ visible: true, type: "error", message: err.response.data.error.message.value })
            } else {
                setAlert({ visible: true, type: "error", message: JSON.stringify(err) })
            }
        }

        setProgressBarHidden(true)
    }

    async function handleUserDataFetch() {

        const sessionData = getSessionData()
        const { UserInternalKey } = JSON.parse(sessionData)
        const branches = await getBranchesByUserKey(UserInternalKey)
        const mappedBranchesData = await mapBranchesCodesToNames(branches)
        sessionStorage.setItem('Branches', JSON.stringify(mappedBranchesData))
        const permissions = await getPermissionsByUserKey(UserInternalKey)
        sessionStorage.setItem('Permissions', permissions)
        const generalParams = await getB2AgriParameters()
        sessionStorage.setItem('GeneralParams', JSON.stringify(generalParams))
    }

    return (
        <>
            <Grid container justify='center'>
                <Box className={styles.loginLogo}>
                    <Image
                        src="/images/sapb1logo.png"
                        width="175"
                        height="55"
                        alt="Logo"
                    />
                </Box>
            </Grid>
            <TextField
                InputProps={{ startAdornment: <InputAdornment position='start'><AccountCircle /></InputAdornment> }}
                margin="normal"
                required
                label={t['app.login.user.label']}
                name="user"
                value={user}
                onChange={(event) => {
                    setUser(event.target.value)
                }}
                autoFocus
            />
            <TextField
                InputProps={{ startAdornment: <InputAdornment position='start'><LockRounded /></InputAdornment> }}
                margin="normal"
                required
                fullWidth
                name="password"
                label={t['app.login.password.label']}
                type="password"
                value={password}
                onChange={(event) => {
                    setPassword(event.target.value)
                }}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        handleLogin()
                    }
                }}
            />
            <div style={{ heght: 20 }} />
            <Button onClick={handleLogin} id="login" variant="contained" color="primary" fullWidth>
                {t['app.login.submit.btn']}
            </Button>
            <Box hidden={progressBarHidden}>
                <LinearProgress />
            </Box>
            <Box hidden={!alert.visible}>
                <AlertMessage
                    alertOpen={alert.visible}
                    type={alert.type}
                    setAlertOpen={setAlert}
                    message={alert.message}
                />
            </Box>
            <br />
        </>
    )
}