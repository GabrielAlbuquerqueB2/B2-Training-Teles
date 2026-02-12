const axios = require('axios')

const URL = process.env.B1_SERVICE_LAYER_URL;

const api = axios.create({
  baseURL: URL,
});

module.exports = api;