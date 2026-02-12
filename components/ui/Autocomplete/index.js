import TextField from '@mui/material/TextField'
import { Autocomplete as AutocompleteInput } from '@mui/material'
import getTranslation from '../../../locales/getTranslation'

export default function Autocomplete(props) {

    const t = getTranslation()

    return (
        <div>
            <AutocompleteInput
                value={props.value}
                onChange={(event, newValue) => {
                    props.setValue(newValue)
                }}
                onKeyDown={(event) => {
                    if ((event.key === 'Enter' || event.key === 'Tab') && !props.value && props.inputValue.length > 0) {
                        event.preventDefault()
                        props.findOptionsByInputValue(props.inputValue)
                    }

                }}
                inputValue={props.inputValue}
                getOptionLabel={(option) => option.id ? option.id + ' - ' + option.label : ''}
                onInputChange={(event, newInputValue) => {
                    props.setInputValue(newInputValue);
                }}
                noOptionsText={t['app.ui.autocomplete.nooptions-text']}
                options={props.options}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label={props.name} />}
                disabled={props.disabled || false}
            />
        </div>
    )
}