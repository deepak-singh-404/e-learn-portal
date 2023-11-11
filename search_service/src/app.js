const express = require('express');
const morgan = require('morgan')
const mongoose = require('./models/db');
const searchRoutes = require('./routes/searchRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('dev'))
app.use('/api/search', searchRoutes);

mongoose.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.once('open', () => {
    console.log('E-LEARN-SEARCH_SERVICE-DB is connected successfully');
    app.listen(PORT, () => {
        console.log(`SEARCH_SERVICE_IS_LISTENING_ON_PORT: ${PORT}`);
    });
});
