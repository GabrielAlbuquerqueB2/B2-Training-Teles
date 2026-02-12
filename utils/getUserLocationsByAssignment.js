export function getUserLocations() {

    const branches = sessionStorage.getItem('Branches')
    if (branches) {
        const userData = JSON.parse(branches)
        const locations = userData.map(item => {
            return item.ProductionUnit
        })
        const locationsDuplicatedsRemoved = [...new Map(locations.map((l) => [l.Code, l])).values()];
        return locationsDuplicatedsRemoved
    }
}


export function getUserBranches() {

    const branches = sessionStorage.getItem('Branches')    

    if (branches) {
        const userData = JSON.parse(branches)
        const brc = userData.map(item => {
            return item.BusinessPlaces
        })
        const branchesDuplicatedsRemoved = [...new Map(brc.map((b) => [b.BPLID, b])).values()];
        return branchesDuplicatedsRemoved
    }
}

export function getWarehousesByUserBranch(branch) {

    const branches = sessionStorage.getItem('Branches')
    if (branches) {
        const userData = JSON.parse(branches)
        const warehouses = userData.map(item => {
            return item.Warehouses
        })
        const filteredWarehouses = warehouses.filter(item => {
            return item.BusinessPlaceID === parseInt(branch)
        })
        const warehousesDuplicatedsRemoved = [...new Map(filteredWarehouses.map((w) => [w.WarehouseCode, w])).values()];
        return warehousesDuplicatedsRemoved
    }
}

export function getUserWarehouses() {
    const branches = sessionStorage.getItem('Branches')
    if (branches) {
        const userData = JSON.parse(branches)
        const warehouses = userData.map(item => {
            return item.Warehouses
        })
        const warehousesDuplicatedsRemoved = [...new Map(warehouses.map((w) => [w.WarehouseCode, w])).values()];
        return warehousesDuplicatedsRemoved
    }
}

export function getWarehousesByLocation(location) {

    const branches = sessionStorage.getItem('Branches')
    if (branches) {
        const userData = JSON.parse(branches)

        const filteredByLocation = userData.filter(branch => {            
            return branch.ProductionUnit.Code.toString() === location && branch.Warehouses.U_B2AG_AgriOperation === 'A'
        })
        const warehouses = filteredByLocation.map(item => {
            return item.Warehouses
        })

        const warehousesDuplicatedsRemoved = [...new Map(warehouses.map((w) => [w.WarehouseCode, w])).values()];
        return warehousesDuplicatedsRemoved
    }
}
