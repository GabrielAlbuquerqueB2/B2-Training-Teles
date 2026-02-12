const axios = require('axios')

const APIGatewayLogin = async (req, res) => {

    const API_GATEWAY_URL = process.env.B1_API_GATEWAY_URL;

    axios.post(`${API_GATEWAY_URL}/login`, {

        "CompanyDB": process.env.B1_COMPANY_DB,
        "UserName": process.env.B1_USERNAME,
        //"DBInstance": "NDB@hanadb:30013",
        "Password": process.env.B1_PASSWORD

    }).then((response) => {

        global.apiGatewaySessionId = response.headers['set-cookie'][0] ;
        console.log('API Gateway Token: ', global.apiGatewaySessionId)
        return;
    }).catch((error) => {

        console.log(error);
    });
};

module.exports = APIGatewayLogin;