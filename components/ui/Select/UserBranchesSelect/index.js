import { useState, useEffect } from 'react'
import Select from '../index'
import { getUserBranches } from '../../../../utils/getUserLocationsByAssignment'

export default function UserBranchSelect(props) {

    const [branchesList, setBranchesList] = useState([])

    useEffect(() => {
        const branches = getUserBranches().map(branch => {
            return {value: branch.BPLID, description: branch.BPLName}
        })
        setBranchesList(branches)
    },[])

    return (
        <>
            <Select
                {...props} 
                list={branchesList}
            />
        </>
    )
}