import { useState, useEffect } from 'react'
import Select from '../index'
import { getWarehousesByUserBranch } from '../../../../utils/getUserLocationsByAssignment'

export default function WarehousesByBranchSelect(props) {

    const [warehousesList, setWarehousesList] = useState([])

    useEffect(() => {
        if(props.branch) {            
            const warehouses = getWarehousesByUserBranch(props.branch).map(branch => {
                return {value: branch.WarehouseCode, description: `${branch.WarehouseCode} - ${branch.WarehouseName}`}
            })
            setWarehousesList(warehouses)
        }
    },[props.branch])

    return (
        <>
            <Select
                {...props} 
                list={warehousesList}
                sx={{ width: 300 }}
            />
        </>
    )
}