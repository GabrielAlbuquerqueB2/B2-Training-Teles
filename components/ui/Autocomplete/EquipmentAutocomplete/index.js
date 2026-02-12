import { useState } from 'react'
import Autocomplete from '../index.js'
import { getEquipmentListByDescription } from './EquipmentAutocompleteService'

export default function EquipmentAutocomplete(props) {

    const [options, setOptions] = useState([])
    const [inputValue, setInputValue] = useState('');

    async function findOptionsByInputValue(inputValue) {
        const equipmentList = await getEquipmentListByDescription(inputValue, props.location)
        setOptions(equipmentList)
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