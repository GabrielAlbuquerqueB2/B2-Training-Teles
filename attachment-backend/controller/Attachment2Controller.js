const axios = require('axios')
const request = require('request');

module.exports = {
    findAttachmentListById(req, res) {

        const URL = process.env.B1_SERVICE_LAYER_URL;

        const options = {
            method: 'GET',
            url: `${URL}/Attachments2(${req.params.AttachmentEntry})/`,
            headers: {
                cookie: global.sessionId,
                'content-type': 'application/json'
            }
        };

        axios.request(options)
            .then(function (response) {

                res.status(response.status).send(JSON.stringify(response.data));
            })
            .catch(function (error) {

                res.status(400).send(error);
            });
    },

    findByAttachmentName(req, res) {

        const URL = process.env.B1_SERVICE_LAYER_URL;

        const options = {
            method: 'GET',
            url: `${URL}/Attachments2(${req.params.AttachmentEntry})/$value?filename='${req.params.FileName}'`,

            headers: {
                cookie: global.sessionId,
                'content-type': 'application/json'
            },
            responseType: 'arraybuffer'
        };

        axios.request(options)
            .then(function (response) {

                res.status(response.status).send(response.data);
            })
            .catch(function (error) {

                res.status(400).send(error);
            });
    },

    async createAttachment(req, res) {

        // Cria o formData através dos arquivos recebidos
        const createFormDataFromFiles = async (files) => {

            let formData = [];

            Object.values(files).forEach((file, index) => {

                const fileBuffer = file.data;
                fileBuffer.name = `${Math.random().toString(36).substring(3)}_${file.name}`
                formData.push(fileBuffer);
            })

            return formData;
        }

        const sendRequest = async (formData) => {

            const URL = process.env.B1_SERVICE_LAYER_URL;

            const options = {
                method: 'POST',
                url: `${URL}/Attachments2`,

                headers: {
                    'Cookie': global.sessionId,
                    'Content-Type': 'multipart/form-data'
                },
                formData: formData

            };

            request(options, function (err, response, body) {

                if (err) {
                    res.status(response.statusCode).send(err);

                } else {
                    return res.status(response.statusCode).send(JSON.parse(response.body));
                }

            });
        }

        if (req.files) {

            const formData = await createFormDataFromFiles(req.files);
            await sendRequest(formData);

        } else {
            res.send('Nada aqui')
        }
    },

    async updateAttachment(req, res) {       

        // Cria o formData através dos arquivos recebidos
        const createFormDataFromFiles = async (files) => {

            let formData = [];

            Object.values(files).forEach((file, index) => {

                const fileBuffer = file.data;
                fileBuffer.name = `${Math.random().toString(36).substring(3)}_${file.name}`
                formData.push(fileBuffer);
            })

            return formData;
        }

        const sendRequest = async (formData) => {

            const URL = process.env.B1_SERVICE_LAYER_URL;

            const options = {
                method: 'PATCH',
                url: `${URL}/Attachments2(${req.params.AttachmentEntry})`,

                headers: {
                    'Cookie': global.sessionId,
                    'Content-Type': 'multipart/form-data'
                },
                formData: formData
            };
            
            request(options, function (err, response, body) {

                if (err) {
                    res.status(500).send(err);

                } else {

                    return res.status(204).send({message: 'Atualizado com sucesso'});
                }

            });
        }

        if (req.files) {

            const formData = await createFormDataFromFiles(req.files);
            await sendRequest(formData);


        } else {
            res.send('Nada aqui')
        }



    },
}