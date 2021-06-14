const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const paymentController = require('../controllers/payment-controller');

router.post("/new", paymentController.userPaymentInfo);

router.post("/pay", paymentController.payment);

module.exports = router;