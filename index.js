// Import the Express module
const express = require('express');
const bodyParser = require('body-parser');
const ssppRouter = require('./sspp');

// Create an Express application
const app = express();
app.use(bodyParser.json());


// Server Side Prototype Pollution
app.use('/sspp/', ssppRouter);

// Start the Express server
const PORT = process.env.PORT || 3000; // Use the port specified in the environment variable 'PORT', or default to 3000
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});