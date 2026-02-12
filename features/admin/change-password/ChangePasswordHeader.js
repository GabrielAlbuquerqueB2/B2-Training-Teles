import React from "react";
import { TextField, Grid, Box, InputAdornment } from "@mui/material"
import { AccountCircle, LockRounded } from '@mui/icons-material'

export default function ChangePasswordHeader(props) {
    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Usuário"
                            type="text"
                            value={props.data.userName}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}>
                        <TextField
                            InputProps={{ startAdornment: <InputAdornment position='start'><LockRounded /></InputAdornment> }}
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label={'Senha Atual'}
                            type="password"
                            value={props.data.password}
                            onChange={(event) => {
                                props.setData({...props.data, password: event.target.value})
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}>
                        <TextField
                            InputProps={{ startAdornment: <InputAdornment position='start'><LockRounded /></InputAdornment> }}
                            margin="normal"
                            required
                            fullWidth
                            name="newPassword"
                            label={'Nova Senha'}
                            type="password"
                            value={props.data.newPassword}
                            onChange={(event) => {
                                props.setData({...props.data, newPassword: event.target.value})
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}>
                        <TextField
                            InputProps={{ startAdornment: <InputAdornment position='start'><LockRounded /></InputAdornment> }}
                            margin="normal"
                            required
                            fullWidth
                            name="newPasswordConfirm"
                            label={'Confirmação de Nova Senha'}
                            type="password"
                            value={props.data.newPasswordConfirm}
                            onChange={(event) => {
                                props.setData({...props.data, newPasswordConfirm: event.target.value})
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}></Grid>
                </Grid>
            </Box>
        </>
    )
}