import { TextField } from '@mui/material'

export default function DateField(props) {

    return (
        <>
            <TextField
                type="date"
                inputFormat="DD/MM/YYYY"
                {...props}
            />

        </>
    )
}