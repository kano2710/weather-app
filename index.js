const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const weatherScheduler = require('./scheduler/weatherScheduler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    weatherScheduler.start();
});

// Graceful shutdown
// development
process.on('SIGINT', () => {
    console.log('\nShutting down...');
    weatherScheduler.stop();
    process.exit(0);
});

// production
process.on('SIGTERM', () => {
    console.log('\nShutting down...');
    weatherScheduler.stop();
    process.exit(0);
});
