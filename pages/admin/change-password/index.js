import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import PageHeader from '../../../components/ui/PageHeader'
import ChangePasswordHeader from '../../../features/admin/change-password/ChangePasswordHeader'
import ChangePasswordActions from '../../../features/admin/change-password/ChangePasswordActions'
import { getSessionData } from '../../../utils/frontEndGetSessionData'
import getTranslation from '../../../locales/getTranslation'
import { Box } from '@mui/material'
import AlertMessage from '../../../components/ui/AlertMessage'

export default function ChangePassword() {

    const router = useRouter()
    const t = getTranslation()
    const [data, setData] = useState({ userName: '', password: '', newPassword: '', newPasswordConfirm: '' })
    const [alert, setAlert] = useState({ visible: false, type: "", message: '' })

    useEffect(() => {

        const sessionData = getSessionData()
        if (sessionData) {
            setData({ userName: `${JSON.parse(sessionData).user}` })
        }
    }, [])

    return (
        <>
            <PageHeader
                //title={t["app.admin.user-defined-fields.title"]}
                title={'Alteração de Senha'}
            />
            <ChangePasswordHeader
                data={data}
                setData={setData}
            />
            <ChangePasswordActions
                data={data}
                setAlert={setAlert}
            />
            <Box hidden={!alert.visible}>
                <AlertMessage
                    alertOpen={alert.visible}
                    type={alert.type}
                    setAlertOpen={setAlert}
                    message={alert.message}
                />
            </Box>
        </>
    )
}