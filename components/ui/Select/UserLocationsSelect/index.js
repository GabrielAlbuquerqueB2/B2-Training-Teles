import { useState, useEffect } from 'react'
import Select from '../index'
import { getUserLocations } from '../../../../utils/getUserLocationsByAssignment'

export default function UserLocationsSelect(props) {

    const [locationsList, setLocationsList] = useState([])

    useEffect(() => {
        const locations = getUserLocations().map(location => {
            return {value: location.Code, description: location.Name}
        })
        setLocationsList(locations)
    },[])

    return (
        <>
            <Select
                {...props} 
                list={locationsList}
            />
        </>
    )
}