import { useState, useEffect } from 'react'
import Select from '../index'
import { getUserWarehouses } from '../../../../utils/getUserLocationsByAssignment'

export default function UserWarehousesSelect(props) {

    const [warehousesList, setWarehousesList] = useState([])

    useEffect(() => {
        const warehouses = getUserWarehouses().map(warehouse => {
            return {value: warehouse.WarehouseCode, description: warehouse.WarehouseName}
        })
        setWarehousesList(warehouses)
    },[])

    return (
        <>
            <Select
                {...props} 
                list={warehousesList}
            />
        </>
    )
}