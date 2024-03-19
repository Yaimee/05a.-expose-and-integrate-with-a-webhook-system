import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle POST requests to '/webhook' endpoint
app.post('/webhook', (req, res) => {
    console.log('Webhook received:', req.body);

    // Process the webhook data
    // This is where you would typically handle payment events, such as processing payments,
    // updating order status, sending notifications, etc.

    // Respond to the webhook sender to acknowledge receipt
    res.status(200).send('Webhook received');
});

app.post('/register-webhook', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }
    await db.insert({ url });
    res.json({ message: 'Webhook registered', url });
});

app.post('/unregister-webhook', async (req, res) => {
    const { url } = req.body;
    await db.remove({ url }, {});
    res.json({ message: 'Webhook unregistered', url });
});

app.post('/simulate-payment', async (req, res) => {
    const { amount, currency } = req.body;
    const eventPayload = {
        eventType: 'payment_received',
        amount,
        currency,
    };

    const webhooks = await db.find({});
    webhooks.forEach(webhook => {
        console.log(`Triggering payment event to ${webhook.url}`, eventPayload);
        // Example: axios.post(webhook.url, eventPayload);
    });

    res.json({ message: "Simulated payment event", eventPayload });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
