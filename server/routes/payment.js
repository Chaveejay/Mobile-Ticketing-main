const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency, payment_method_types } = req.body; // Get parameters from the request body

        // Create a payment intent with the received parameters
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Amount in cents
            currency: currency, // Currency
            payment_method_types: payment_method_types, // Payment method types
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
