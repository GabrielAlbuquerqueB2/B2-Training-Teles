const axios = require('axios')

module.exports = {

    batchDetailsReport(req, res) {

        const URL = process.env.B1_API_GATEWAY_URL;
        const batchNumber = req.params.BatchNumber

        const options = {
            method: 'POST',
            url: `${URL}/rs/v1/ExportPDFData`,
            params: { DocCode: 'RCRI0030' },
            headers: {
                cookie: global.apiGatewaySessionId.substring(0, 44),
                'Content-Type': 'application/json'
            },
            data: [
                {
                    name: 'Batch',
                    type: 'xsd:string',
                    value: [[`${batchNumber}`]]
                }
            ]
        };

        axios.request(options)
            .then(function (response) {
                const link = response.data             
                return link
            })
            .then(function (data) {
                res.set({
                    'Content-Disposition' : 'attachment; filename='+ `${batchNumber}.pdf`,
                    'Content-Type': 'application/pdf',
                });
                res.send(Buffer.from(data, 'base64'));
            })
            .catch(function (error) {
                console.error(error);
            });
    },

    quotations(req, res) {

        const URL = process.env.B1_API_GATEWAY_URL;
        const DocEntry = req.params.DocEntry
        const DocNum = req.params.DocNum

        const options = {
            method: 'POST',
            url: `${URL}/rs/v1/ExportPDFData`,
            params: { DocCode: 'RCRI0036' },
            headers: {
                cookie: global.apiGatewaySessionId.substring(0, 44),
                'Content-Type': 'application/json'
            },
            data: [
                {
                    name: 'DocKey@',
                    type: 'xsd:string',
                    value: [[`${DocEntry}`]]
                }
            ]
        };

        axios.request(options)
            .then(function (response) {
                const link = response.data             
                return link
            })
            .then(function (data) {
                res.set({
                    'Content-Disposition' : 'attachment; filename='+ `Cotação ${DocNum}.pdf`,
                    'Content-Type': 'application/pdf',
                });
                res.send(Buffer.from(data, 'base64'));
            })
            .catch(function (error) {
                console.error(error);
            });
    },

    separationMap(req, res) {

        const URL = process.env.B1_API_GATEWAY_URL;
        const DocEntry = req.params.DocEntry
        const DocNum = req.params.DocNum

        const options = {
            method: 'POST',
            url: `${URL}/rs/v1/ExportPDFData`,
            params: { DocCode: 'RCRI0041' },
            headers: {
                cookie: global.apiGatewaySessionId.substring(0, 44),
                'Content-Type': 'application/json'
            },
            data: [
                {
                    name: 'DocKey@',
                    type: 'xsd:string',
                    value: [[`${DocEntry}`]]
                }
            ]
        };

        axios.request(options)
            .then(function (response) {
                const link = response.data             
                return link
            })
            .then(function (data) {
                res.set({
                    'Content-Disposition' : 'attachment; filename='+ `Mapa Separação ${DocNum}.pdf`,
                    'Content-Type': 'application/pdf',
                });
                res.send(Buffer.from(data, 'base64'));
            })
            .catch(function (error) {
                console.error(error);
            });
    },

    orders(req, res) {

        const URL = process.env.B1_API_GATEWAY_URL;
        const DocEntry = req.params.DocEntry
        const DocNum = req.params.DocNum

        const options = {
            method: 'POST',
            url: `${URL}/rs/v1/ExportPDFData`,
            params: { DocCode: 'RCRI0037' },
            headers: {
                cookie: global.apiGatewaySessionId.substring(0, 44),
                'Content-Type': 'application/json'
            },
            data: [
                {
                    name: 'DocKey@',
                    type: 'xsd:string',
                    value: [[`${DocEntry}`]]
                }
            ]
        };

        axios.request(options)
            .then(function (response) {
                const link = response.data             
                return link
            })
            .then(function (data) {
                res.set({
                    'Content-Disposition' : 'attachment; filename=' + `Pedido de Venda ${DocNum}.pdf`,
                    'Content-Type': 'application/pdf',
                });
                res.send(Buffer.from(data, 'base64'));
            })
            .catch(function (error) {
                console.error(error);
            });
    }
}
