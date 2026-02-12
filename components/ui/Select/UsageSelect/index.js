import { useState, useEffect } from 'react'
import Select from '../index'
import { getAllUsages } from './UsageSelectService'

export default function UsageSelect(props) {

    const [usageList, setUsageList] = useState([])

    useEffect(async () => {
        const usages = await getAllUsages()
        setUsageList(usages)
    },[])

    return (
        <>
            <Select
                {...props} 
                list={usageList}
            />
        </>
    )
}