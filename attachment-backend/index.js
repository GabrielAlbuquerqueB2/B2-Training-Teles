const express = require('express')
const router = require('./routes/routes.js')
const cors = require('cors')
const bodyParser = require('body-parser')
const Login = require('./controller/ServiceLayerLoginController.js')
const APIGatewayLogin = require('./controller/APIGatewayLoginController.js')
const dotenv = require('dotenv')
const upload = require('express-fileupload')
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Ignora SSL para desenvolvimento
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

// Trata corpo das requisições
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Habilita o Cors
app.use(cors());

// Habilta upload de arquivos
app.use(upload());

// Habilita middleware do Roteador do Express
app.use(router);

// Trata login com o Service Layer e API Gateway - Renova token a cada 25 minutos
Login();
APIGatewayLogin();
setInterval(() => { 
    Login();
    APIGatewayLogin();
}, 1000 * 60 * 25);

// Inicia a aplicação
app.listen(PORT, () => {
    console.log(`Server Listen on Port ${PORT}`);
});