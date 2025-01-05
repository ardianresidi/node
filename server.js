// Import the express module
const express = require('express');

// Create an instance of the express application
const app = express();

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Set the port to 3000
const port = 4000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
