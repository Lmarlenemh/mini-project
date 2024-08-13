const express = require('express');
    const path = require('path');
const connectDB = require('../config/db');
const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));


// Serve static files
app.use(express.static(path.join(__dirname, '../public')));


// Define Routes
app.use('/api/scores', require('./routes/scores'));

// Route for the root URL
/*app.get('/', (req, res) => {
    res.send('Hello, world!');
  });*/

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
