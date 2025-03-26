// File: server.js or routes/payment.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config(); // For environment variables

router.post('/process-payment', async (req, res) => {
  try {
    // Get the payment data from the request body
    const paymentData = req.body;

    // Make the request to Viva Wallet API from your server
    const response = await axios.post(
      'https://demo-api.vivapayments.com/checkout/v2/orders',
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${process.env.VIVA_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Return the response from Viva Wallet to your frontend
    return res.status(200).json(response.data);
  } catch (error) {
    console.error(
      'Viva Wallet API error:',
      error.response?.data || error.message
    );
    return res.status(error.response?.status || 500).json({
      message: 'Payment processing failed',
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
