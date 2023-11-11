const express = require('express');
const morgan = require('morgan');
const mongoose = require('./models/db');
const feedbackRoute = require('./routes/feedbackRoute');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('dev'));
app.use('/api/feedback', feedbackRoute);

mongoose.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.once('open', () => {
    console.log('E-LEARN-FEEDBACK_SERVICE-DB is connected successfully');
    app.listen(PORT, () => {
        console.log(`FEEDBACK_SERVICE_IS_LISTENING_ON_PORT: ${PORT}`);
    });
});
