
import { Button, Box, Grid } from '@mui/material'
import { editpassword, decodeSessionData, decodePassword } from './ChangePasswordServices'
import { destroyCookie, parseCookies } from 'nookies'
import { useRouter } from 'next/router'
import { getSessionData } from '../../../utils/frontEndGetSessionData'


export default function ChangePasswordActions(props) {

    const router = useRouter()

    function handleLogout() {

        destroyCookie({}, 'session', {
            path: '/',
        })
        sessionStorage.clear()
        router.push('/login')
    };



    async function validateCurrentPassword(atualPassword) {
        const sessionData = JSON.parse(getSessionData())
        const decodedPassword = decodePassword(sessionData)
        console.log(decodedPassword)
        return decodedPassword === atualPassword
    }

    const handleSubmit = async () => {
        try {
            const { password, newPassword, newPasswordConfirm } = props.data;

            if (!password || !newPassword || !newPasswordConfirm) {
                throw new Error('Todos os campos devem ser preenchidos.');
            }

            if (newPassword.length < 4) {
                throw new Error('A nova senha deve ter no mínimo 4 caracteres.');
            }

            if (newPassword !== newPasswordConfirm) {
                throw new Error('Nova senha e confirmação estão divergentes.');
            }

            const isValid = await validateCurrentPassword(password);
            console.log(isValid)
            if (!isValid) {
                throw new Error('A senha atual não é válida.');
            }

            if (password === newPassword) {
                throw new Error('Nova senha deve ser diferente da Senha Atual.');
            }

            const sessionData = getSessionData();
            const { UserInternalKey } = JSON.parse(sessionData);
            const result = await editpassword(UserInternalKey, newPassword);

            props.setAlert({ visible: true, type: "success", message: 'Senha alterada com sucesso!' });

            setTimeout(() => {
                handleLogout();
            }, 3000);

        } catch (error) {
            console.log(error);
            const errorMessage = error.response ? error.response.data.error.message.value : error.message;
            props.setAlert({ visible: true, type: "error", message: errorMessage });
        }
    };



    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}>
                        <Button onClick={handleSubmit} id="login" variant="contained" color="primary" fullWidth>
                            Alterar Senha
                        </Button>
                    </Grid>
                    <Grid item xs={4}></Grid>
                </Grid>
            </Box>

        </>
    )
}

