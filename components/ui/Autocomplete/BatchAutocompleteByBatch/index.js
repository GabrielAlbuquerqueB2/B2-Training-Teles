import { useState } from 'react'
import Autocomplete from '../index.js'
import { getBatchListByDescription } from './batchAutoCompleteService.js';


export default function BatchAutocomplete(props) {

    const [options, setOptions] = useState([])
    const [inputValue, setInputValue] = useState('');

    async function findOptionsByInputValue(inputValue) {
        const itemList = await getBatchListByDescription(inputValue)
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
            />
        </>
    )
}