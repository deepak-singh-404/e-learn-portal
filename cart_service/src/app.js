const express = require('express');
const morgan = require('morgan');
const mongoose = require('./models/db');
const cartRoutes = require('./routes/cartRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('dev'));
app.use('/api/cart', cartRoutes);

mongoose.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.once('open', () => {
    console.log('E-LEARN-CART_SERVICE-DB is connected successfully');
    app.listen(PORT, () => {
        console.log(`CART_SERVICE_IS_LISTENING_ON_PORT: ${PORT}`);
    });
});
