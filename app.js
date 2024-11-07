const express = require('express');
const redis = require('redis');
const app = express();
const PORT = process.env.PORT || 3000;

const client = redis.createClient({
    url: 'redis://redis:6379'
});

client.connect().catch(console.error);

client.on('error', (err) => {
    console.error('Redis connection error:', err);
});

app.get('/', async (req, res) => {
    try {
        if (!client.isOpen) {
            await client.connect();
        }

        await client.set('message', 'Coucou de Regis! Heuu Redis');
        const reply = await client.get('message');
        res.send(reply || 'No message found');
    } catch (err) {
        console.error('Error interacting with Redis:', err);
        res.status(500).send('Server error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
