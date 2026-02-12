import { useState } from 'react'
import Autocomplete from '../index.js'
import { getEmployeesListByDescription } from './EmployeeAutocompleteService'

export default function ItemAutocomplete(props) {

    const [options, setOptions] = useState([])
    const [inputValue, setInputValue] = useState('');

    async function findOptionsByInputValue(inputValue) {
        const employeesList = await getEmployeesListByDescription(inputValue)
        setOptions(employeesList)
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