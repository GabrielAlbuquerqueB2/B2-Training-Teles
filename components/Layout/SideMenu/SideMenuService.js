import axios from 'axios'
import Api from '../../../lib/api'

async function doApiCall(query) {

    return axios.request(query)
        .then((response) => {
            if (response.data) {
                return response.data
            } else {
                return {}
            }
        }).catch((error) => {
            console.log(error)
            return error
        })
}

export async function getUserPermissions(userInternalKey) {
    const query = new Api()
        .setMethod('GET')
        .setUrl(`/Users(${userInternalKey})`)
        .setParams({
            $select: 'UserCode,U_B2AG_Permissions'
        })
        .get()

    const data = await doApiCall(query)
    return data
}