const axios = require('axios')

const login = async (req, res) => {

    const URL = process.env.B1_SERVICE_LAYER_URL;

    axios.post(`${URL}/Login`, {

        "CompanyDB": process.env.B1_COMPANY_DB,
        "UserName": process.env.B1_USERNAME,
        "Password": process.env.B1_PASSWORD,
        "Language": 29

    }).then((response) => {

        global.sessionId = response.headers['set-cookie'][0] + response.headers['set-cookie'][1];
        console.log('Service Layer Token: ', global.sessionId)
        return;
    }).catch((error) => {

        console.log(error);
    });
};

module.exports = login;