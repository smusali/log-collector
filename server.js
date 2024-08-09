const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const app = express();
app.use(bodyParser.json());

const LOG_DIR = '/var/log';

// Endpoint to list available log files
app.get('/logs', async (req, res) => {
    try {
        const files = fs.readdirSync(LOG_DIR);
        res.json(files);
    } catch (error) {
        res.status(500).send('Error reading log directory');
    }
});

// Endpoint to get logs from a specified file
app.get('/logs/:filename', async (req, res) => {
    const { filename } = req.params;
    const { keyword, limit = 100 } = req.query;
    const filePath = path.join(LOG_DIR, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found');
    }

    const fileStats = fs.statSync(filePath);
    const fileSize = fileStats.size;
    const stream = fs.createReadStream(filePath, {
        start: Math.max(0, fileSize - 1024 * 1024 * 5) // Read last 5MB
    });

    const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });

    let lines = [];
    for await (const line of rl) {
        if (!keyword || line.includes(keyword)) {
            lines.push(line);
            if (lines.length > limit) {
                lines.shift();
            }
        }
    }

    res.json(lines.reverse());
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server };
