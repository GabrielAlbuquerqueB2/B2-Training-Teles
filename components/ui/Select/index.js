import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'

const uniqueId = () => parseInt(Date.now() * Math.random()).toString()

export default function SelectComponent(props) {
    
    const id = uniqueId()

    return (
        <FormControl variant="outlined" size="small" fullWidth sx={props.sx}>
            <InputLabel id={id}>{props.label}</InputLabel>
            <Select
                name={props.name || ''}
                labelId={id}
                id={uniqueId()}
                label={props.label}
                value={props.value || ''}
                onBlur={props.onBlur}
                disabled={props.disabled || false}
                defaultValue = ""
                onChange={(event) => { 
                    if(props.father) {
                        props.setState(props.father, props.name, props.index, event.target.value)
                    } else if(props.name) {
                        props.setState(props.name, event.target.value)
                    } else {
                        props.setState(event.target.value)
                    }
                    if(props.actionAfterChange) {
                        props.actionAfterChange()
                    }
                 }}                
            >
                {props.list?.length > 0 &&

                props.list?.map((item, index) => {
                    return (
                        <MenuItem key={index} value={item.value}>{item.description}</MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    )
}