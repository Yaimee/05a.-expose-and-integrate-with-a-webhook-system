import express from 'express';
import axios from 'axios';
import Datastore from 'nedb-promises';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const db = Datastore.create('./webhooks.db');

app.get('/ping', async (req, res) => {
    const webhooks = await db.find();
    webhooks.forEach(webhook => {
        console.log(`Pinging ${webhook.url}`);
        axios.post(webhook.url, { data: "Ping event triggered" });
    });
    res.json({ message: "Pinged all registered webhooks" });
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

    const webhooks = await db.find();
    webhooks.forEach(webhook => {
        console.log(`Triggering payment event to ${webhook.url}`, eventPayload);
        axios.post(webhook.url, eventPayload);
    });

    res.json({ message: "Simulated payment event", eventPayload });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
