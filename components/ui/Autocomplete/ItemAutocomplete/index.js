import { useState } from 'react'
import Autocomplete from '../index.js'
import { getItemListByDescription } from './ItemAutocompleteService'

export default function ItemAutocomplete(props) {

    const [options, setOptions] = useState([])
    const [inputValue, setInputValue] = useState('');

    async function findOptionsByInputValue(inputValue) {
        const itemList = await getItemListByDescription(inputValue)
        setOptions(itemList)
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