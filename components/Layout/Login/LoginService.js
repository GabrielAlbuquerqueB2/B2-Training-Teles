import axios from 'axios'
import Api from '../../../lib/api'

export async function getBranchesByUserKey(InternalKey) {

    const query = new Api()
        .setMethod('GET')
        .setUrl(`/Users(${InternalKey})`)
        .get()

    return axios.request(query)
        .then((response) => {
            return response.data.UserBranchAssignment
        }).catch((error) => {
            throw new Error(error)
        })
}

function setParameters(objParams){
    let params = {}
    for (let obj of objParams){
        params[obj.Code] = obj.Name
    }  
    return params
}

export async function getB2AgriParameters() { 
    
        const query = new Api()
            .setMethod('GET')
            .setUrl(`/B2AgriParameters`)
            .setParams({
                $select: 'Code,Name'
            })
            .get()
    
        return axios.request(query)
            .then((response) => {
                const generalParameters = setParameters(response.data.value)
                return generalParameters
            }).catch((error) => {
                throw new Error(error)
            })
    
}

export async function getPermissionsByUserKey(InternalKey) {

    const query = new Api()
        .setMethod('GET')
        .setUrl(`/Users(${InternalKey})`)
        .get()

    return axios.request(query)
        .then((response) => {
            return response.data.U_B2AG_Permissions
        }).catch((error) => {
            throw new Error(error)
        })
}

export async function mapBranchesCodesToNames(userBranchesCodes) {
    if (!Array.isArray(userBranchesCodes) || userBranchesCodes.length === 0) {
        return [];
    }

    // Divide os BPLIDs em lotes de 20
    const chunkSize = 20;
    const bplIdChunks = [];
    for (let i = 0; i < userBranchesCodes.length; i += chunkSize) {
        bplIdChunks.push(userBranchesCodes.slice(i, i + chunkSize));
    }

    // Função para buscar um lote
    const fetchChunk = async (chunk) => {
        const bplIds = chunk.map(b => b.BPLID);
        const filter = bplIds.map(id => `(BusinessPlaces/BPLID eq ${id})`).join(' or ');

        const query = new Api()
            .setMethod('GET')
            .setUrl(`/$crossjoin(BusinessPlaces,Warehouses,ProductionUnit)`)
            .setParams({
                $expand: 'BusinessPlaces($select=BPLID,BPLName),Warehouses($select=WarehouseCode,WarehouseName,BusinessPlaceID,U_B2AG_AgriOperation),ProductionUnit($select=Code,Name)',
                $filter: `BusinessPlaces/BPLID eq Warehouses/BusinessPlaceID and Warehouses/Location eq ProductionUnit/Code and (${filter})`,
                $orderby: 'ProductionUnit/Code asc'
            })
            .get();

        const response = await axios.request(query);
        return response.data.value;
    };

    // Busca todos os lotes em paralelo
    const results = await Promise.all(bplIdChunks.map(fetchChunk));

    // Junta todos os resultados em um único array
    return results.flat();
}