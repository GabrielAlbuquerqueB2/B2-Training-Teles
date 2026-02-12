import axios from 'axios'
import Api from '../../../lib/api'
const CryptoJs = require('crypto-js')
//import { decrypt } from '../../../utils/textCrypto'

function decrypt(data) {
    const bytes  = CryptoJs.AES.decrypt(data, process.env.NEXT_PUBLIC_B1_CRYPTO_SECRET);
    return bytes.toString(CryptoJs.enc.Utf8);
}

 export function decodePassword(sessionData) {
    if(sessionData) {
        const password = decrypt(sessionData.password)
        return password
    } else {
        return false
    }
}

async function doApiCall(query) {

    return axios.request(query)
        .then((response) => {
            if (response.data) {
                return response.data
            } else {
                return {}
            }
        }).catch((error) => {
            return (error.response)
        })
}

export async function getUserIdByUserCode() {
    const query = new Api()
        .setMethod('PATCH')
        .setUrl(`/Users(${id})`)
        .setData({"UserPassword": newPassword})
        .get()

    const result = await doApiCall(query)
    if (result.status !== 'undefined') {
        if (result.status === 400) {
            const errorMessage = result ? result.data.message.value : 'Unknown error'
            throw new Error(errorMessage)
        }
        return result
    }
    return result
}

export async function editpassword(id, newPassword) {
    const query = new Api()
        .setMethod('PATCH')
        .setUrl(`/Users(${id})`)
        .setData({"UserPassword": newPassword})
        .get()

    const result = await doApiCall(query)
    if (result.status !== 'undefined') {
        if (result.status === 400) {
            const errorMessage = result ? result.data.message.value : 'Unknown error'
            throw new Error(errorMessage)
        }
        return result
    }
    return result
}

