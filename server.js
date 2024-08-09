const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const app = express();
app.use(bodyParser.json());

const LOG_DIR = '/var/log';
const TEXT_FILE_REGEX = /\.(log|txt|out|in|csv)$/i;
const FIVE_MB = 1024 * 1024 * 5;

// Helper function to read log lines from a file
const readLogLines = async (filePath, start, keyword, limit) => {
    console.log(`Reading log lines from ${filePath} starting at byte ${start}`);
    let count = 0;
    const stream = fs.createReadStream(filePath, {
        start: start > 0 ? start : 0
    });

    const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });

    let lines = [];
    const result = {
        lines: [],
        count: 0
    }
    try {
        for await (const line of rl) {
            if (!keyword || line.includes(keyword)) {
                result.lines.push(line);
                result.count += 1;
                if (result.count >= limit) break;
            }
        }
    } catch (error) {
        console.error(`Error reading log lines: ${error.message}`);
        return result;
    }

    console.log(`Read ${count} log lines`);
    return result;
};

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Helper function to check if the file is a text log file
const isTextLogFile = (filename) => TEXT_FILE_REGEX.test(filename);

// Endpoint to list available log files
app.get('/files', async (req, res) => {
    try {
        console.log(`Listing log files in directory: ${LOG_DIR}`);
        const files = fs.readdirSync(LOG_DIR).filter(isTextLogFile);
        res.json(files);
    } catch (error) {
        console.error(`Error reading log directory: ${error.message}`);
        res.status(500).send('Error reading log directory');
    }
});

// Endpoint to get logs from a specified file
app.get('/logs/:filename', async (req, res) => {
    const { filename } = req.params;
    const { keyword, limit = 100 } = req.query;
    const filePath = path.join(LOG_DIR, filename);

    console.log(`Fetching logs from file: ${filename} with keyword: ${keyword || ''} and limit: ${limit}`);
    if (!isTextLogFile(filename)) {
        console.error(`Invalid file type requested: ${filename}`);
        return res.status(400).send('Invalid file type. Only text log files are supported.');
    }

    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filename}`);
        return res.status(404).send('File not found');
    }

    const fileStats = fs.statSync(filePath);
    const fileSize = fileStats.size;

    let lines = [];
    let offset = 0;
    let count = 0;
    try {
        while (count < limit && offset < fileSize) {
            const start = Math.max(0, fileSize - FIVE_MB * (offset + 1));
            const lineObject = await readLogLines(filePath, start, keyword, limit - count);
            lines = [...lineObject.lines, ...lines];
            count += lineObject.count;
            offset++;
            if (start === 0) break;
        }
    } catch (error) {
        console.error(`Error fetching logs: ${error.message}`);
        return res.status(500).send('Error fetching logs');
    }

    console.log(`Fetched ${lines.length} log lines`);
    res.json(lines.slice(-limit).reverse());
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server };
