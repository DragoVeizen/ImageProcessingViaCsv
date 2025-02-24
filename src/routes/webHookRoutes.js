
// Routes: webhookRoutes.js
const express = require('express');
const { handleWebhook } = require('../controllers/webhookController');
const router = express.Router();
router.get('/:requestId', handleWebhook);
module.exports = router;