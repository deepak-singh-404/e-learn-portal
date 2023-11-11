const express = require('express');
const paymentController = require('../controllers/paymentController')

const router = express.Router();

router.post("/process-payment", paymentController.proccessPayment)

module.exports = router;