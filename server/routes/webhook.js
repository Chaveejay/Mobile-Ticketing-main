const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Middleware to parse raw body for webhook endpoint
router.use(express.raw({ type: 'application/json' }));

router.post('/webhook', (req, res) => {
    const sig = req.headers['stripe-signature'];
    const payload = req.body;

    console.log('Received signature:', sig);
    console.log('Received payload:', payload.toString());

    try {
        // Construct the event from the raw payload
        const event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                console.log('PaymentIntent was successful!');
                break;
            // Handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
    } catch (err) {
        console.error('Webhook Error:', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});

module.exports = router;
