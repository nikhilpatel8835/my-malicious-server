const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 10000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve the static HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// POST endpoint to receive data
app.post('/receive_data', (req, res) => {
    // This is the fixed part
    const receivedData = req.body;
    const text = receivedData.data;

    if (text) {
        console.log("--- NEW DATA RECEIVED ---");
        console.log(text);
        console.log("-------------------------");
    } else {
        console.log("--- EMPTY DATA RECEIVED ---");
    }

    res.status(200).send('Data received');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
