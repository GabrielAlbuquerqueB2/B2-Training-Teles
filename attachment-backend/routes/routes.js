const express = require(`express`)
const PurchaseRequestController = require(`../controller/PurchaseRequestController.js`)
const Attachment2Controller = require(`../controller/Attachment2Controller.js`)
const ReportsController = require(`../controller/ReportsController.js`)

const router = express.Router();

const preUrl = ``; 

router.get(`${preUrl}/node/portalb2agri`, (req, res) => {
    res.send(`SAP B1 Portal Agro`);
})

// Rotas de Relatorios
router.get(`${preUrl}/BatchDetails/:BatchNumber`, ReportsController.batchDetailsReport);
router.get(`${preUrl}/Reports/Quotations/:DocNum/:DocEntry`, ReportsController.quotations);
router.get(`${preUrl}/Reports/SeparationMap/:DocNum/:DocEntry`, ReportsController.separationMap);
router.get(`${preUrl}/Reports/Orders/:DocNum/:DocEntry`, ReportsController.orders);


// Rotas de Anexos
router.get(`${preUrl}/Attachments2/:AttachmentEntry`, Attachment2Controller.findAttachmentListById);
router.get(`${preUrl}/Attachments2/:AttachmentEntry/:FileName`, Attachment2Controller.findByAttachmentName);
router.post(`${preUrl}/Attachments2`, Attachment2Controller.createAttachment);
router.post(`${preUrl}/Attachments2/:AttachmentEntry`, Attachment2Controller.updateAttachment);

// Rotas se Solicitação de Compras
router.patch(`${preUrl}/PurchaseRequest/UpdateAttachments/:DocEntry`, PurchaseRequestController.updateAttachment);

module.exports = router;