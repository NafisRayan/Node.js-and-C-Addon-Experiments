const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/messages', (req, res) => {
    fs.readFile('messages.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read messages' });
        }
        const messages = JSON.parse(data);
        res.json(messages);
    });
});

app.post('/messages', (req, res) => {
    const { username, message } = req.body;
    if (!username || !message) {
        return res.status(400).json({ error: 'Username and message are required' });
    }

    fs.readFile('messages.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read messages' });
        }
        const messages = JSON.parse(data);
        const newMessage = {
            id: Date.now(),
            username,
            message,
            timestamp: new Date().toISOString()
        };
        messages.push(newMessage);

        fs.writeFile('messages.json', JSON.stringify(messages, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to save message' });
            }
            res.status(201).json(newMessage);
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Chat app listening at http://localhost:${port}`);
});