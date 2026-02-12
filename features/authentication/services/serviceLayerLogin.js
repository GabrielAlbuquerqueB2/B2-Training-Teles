import axios from 'axios'
import { encrypt } from '../../../utils/textCrypto'
import clearStringToJson from '../../../utils/clearStringToJson'

export default async function serviceLayerLogin(user, password) {

    const URL = process.env.B1_SERVICE_LAYER_URL

    return axios.post(`${URL}/Login`, {

        "CompanyDB": process.env.B1_COMPANY_DB,
        "UserName": user,
        "Password": password,
        "Language": 29,

    }).then((response) => {

        // Making the session data object with needed informations
        // and encrypting user password
        const sessionData =
        {
            ...response.data,
            ...{ datetimeCreation: new Date() },
            ...{ cookieToken: response.headers['set-cookie'][0] + response.headers['set-cookie'][1] },
            ...{ user: user, password: encrypt(password), isLoggedIn: true }
        }

        return sessionData

    }).then(async (sessionData) => {
        const apiGatewayToken = await getApiGatewayToken(user, password)        
        const currentBase = await getCurrentBaseInfo(sessionData)
        const userId = await getUserId(user, sessionData)
        const sessionDataWithUserKey = { ...sessionData, UserInternalKey: userId}
        const sessionDataWithBase = { ...sessionDataWithUserKey, ...{ CompanyName: currentBase.data.CompanyName } }
        const sessionDataWithApiGatewayToken = { ...sessionDataWithBase, ...{APIGatewayToken: apiGatewayToken} }
        const sanitizedString = clearStringToJson(JSON.stringify(sessionDataWithApiGatewayToken))
        const encodedSessionData = Buffer.from(sanitizedString).toString('base64')

        return encodedSessionData

    }).catch((error) => {

        return error

    })
}

async function getCurrentBaseInfo(sessionData) {

    const URL = process.env.B1_SERVICE_LAYER_URL

    const options = {
        method: 'POST',
        url: `${URL}/CompanyService_GetCompanyInfo`,
        headers: {
            'content-type': 'application/json',
            'cookie': sessionData.cookieToken
        }
    };

    return axios.request(options)
        .then((response) => {
            return response
        })
        .catch(error => {
            return error
        })
}

async function getUserId(user, sessionData) {

    const URL = process.env.B1_SERVICE_LAYER_URL
    const options = {
        method: 'GET',
        url: `${URL}/Users?$filter=UserCode eq '${user}'`,
        headers: {
            'content-type': 'application/json',
            'cookie': sessionData.cookieToken
        }
    }

    return axios.request(options)
        .then((response) => {
            return response.data.value[0].InternalKey
        })
        .catch(error => {
            return error
        })
}
async function getUserBranches(InternalKey, sessionData) {

    const URL = process.env.B1_SERVICE_LAYER_URL
    const options = {
        method: 'GET',
        url: `${URL}/Users(${InternalKey})`,
        headers: {
            'content-type': 'application/json',
            'cookie': sessionData.cookieToken
        }
    }

    return axios.request(options)
        .then(async (response) => {

            return response.data.UserBranchAssignment
        })
        .catch(error => {
            return error
        })
}

async function getApiGatewayToken(user, password) {

    const URL = process.env.B1_API_GATEWAY_URL

    const options = {
        method: 'POST',
        url: `${URL}/login`,
        headers: { 'Content-Type': 'application/json' },
        data: {
            CompanyDB: process.env.B1_COMPANY_DB,
            UserName: 'manager',
            Password: 'B1@admin',
        },

    }

    return axios.request(options).then(function (response) {

        return response.headers['set-cookie'][0].substring(0,44)
    }).catch(function (error) {
        return error
    })

}