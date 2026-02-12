import { useState } from 'react'
import Autocomplete from '../index.js'
import { getBPListByDescription } from './BusinessPartnerAutocompleteService'

export default function BusinessPartnerAutoComplete(props) {

    const [options, setOptions] = useState([])
    const [inputValue, setInputValue] = useState('');

    async function findOptionsByInputValue(inputValue) {
        const bpList = await getBPListByDescription(inputValue)
        setOptions(bpList)
    }

    return (
        <>
            <Autocomplete
                name={props.name}
                options={options}
                findOptionsByInputValue={findOptionsByInputValue}
                value={props.value}
                setValue={props.setValue}
                inputValue={inputValue}
                setInputValue={setInputValue}       
                disabled={props.disabled || false}         
            />
        </>
    )
}