const axios = require('axios')

module.exports = {

  findAll(req, res) {

    const URL = process.env.B1_SERVICE_LAYER_URL;

    const branchsArray = req.body;

    let queryBuilder = '';

    branchsArray.forEach(branch => {
      queryBuilder += `BPL_IDAssignedToInvoice eq ${branch.BPLID} or `
    });

    const query = queryBuilder.slice(0, -3);

    const options = {
      method: 'GET',
      url: `${URL}/PurchaseRequests`,
      params: {
        $select: 'DocEntry,DocNum,DocDate,RequriedDate,Comments,DocumentStatus,Cancelled,BPLName,BPL_IDAssignedToInvoice,RequesterName,U_TX_NDfe',
        $orderby: 'DocNum desc',
        $filter: query
      },
      headers: {
        cookie: global.sessionId,
        'content-type': 'application/json',
        Prefer: 'odata.maxpagesize=0'
      }
    };

    axios.request(options)
      .then(function (response) {

        res.send(JSON.stringify(response.data));
      })
      .catch(function (error) {

        console.error(error);
      });

  },

  findOne(req, res) {

    const URL = process.env.B1_SERVICE_LAYER_URL;

    const options = {
      method: 'GET',
      url: `${URL}/PurchaseRequests(${req.params.DocNum})`,
      params: {
        $select: 'DocEntry,DocNum,DocDate,RequriedDate,Comments,DocumentStatus,Cancelled,BPL_IDAssignedToInvoice,BPLName,AttachmentEntry,DocumentLines'
      },
      headers: {
        cookie: global.sessionId,
        'content-type': 'application/json',
        Prefer: 'odata.maxpagesize=0'
      }
    };

    axios.request(options)
      .then(function (response) {

        res.send(JSON.stringify(response.data));
      })
      .catch(function (error) {

        console.error(error);
      });

  },

  create(req, res) {

    const URL = process.env.B1_SERVICE_LAYER_URL;

    let purchaseRequest = req.body;

    const options = {
      method: 'POST',
      url: `${URL}/PurchaseRequests`,
      headers: { cookie: global.sessionId },
      validateStatus: () => true,
      data: purchaseRequest
    };

    axios.request(options)
      .then((response) => {
        res.send(response.data);
      }).catch((error) => {
        console.log(error)
        res.send(error);
      });

  },

  update(req, res) {

    const URL = process.env.B1_SERVICE_LAYER_URL;

    let purchaseRequest = {
      Comments: req.body.Comments
    };

    const options = {
      method: 'PATCH',
      url: `${URL}/PurchaseRequests(${req.params.DocNum})`,
      headers: { cookie: global.sessionId },
      data: purchaseRequest
    };

    axios.request(options)
      .then((response) => {
        res.send(JSON.stringify(response.data));
      }).catch((error) => {
        console.error(error);
      });

  },

  updateAttachment(req, res) {

    const URL = process.env.B1_SERVICE_LAYER_URL;

    let purchaseRequest = {
      AttachmentEntry: req.body.AttachmentEntry
    };

    const options = {
      method: 'PATCH',
      url: `${URL}/PurchaseRequests(${req.params.DocEntry})`,
      headers: { cookie: global.sessionId },
      data: purchaseRequest
    };

    axios.request(options)
      .then((response) => {
        res.send(JSON.stringify(response.data));
      }).catch((error) => {
        console.error(error);
      });

  },

  close(req, res) {

    const URL = process.env.B1_SERVICE_LAYER_URL;

    const options = {
      method: 'POST',
      url: `${URL}/PurchaseRequests(${req.params.DocNum})/Close`,
      headers: { cookie: global.sessionId }
    };

    axios.request(options)
      .then((response) => {
        res.send(JSON.stringify(response.data));
      }).catch((error) => {
        console.error(error);
      });

  },

  cancel(req, res) {

    const URL = process.env.B1_SERVICE_LAYER_URL;

    const options = {
      method: 'POST',
      url: `${URL}/PurchaseRequests(${req.params.DocNum})/Cancel`,
      headers: { cookie: global.sessionId }
    };

    axios.request(options)
      .then((response) => {
        res.send(JSON.stringify(response.data));
      }).catch((error) => {
        console.error(error);
      });

  }

}
