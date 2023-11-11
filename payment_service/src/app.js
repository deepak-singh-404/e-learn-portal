const express = require('express');
const mongoose = require('./models/db');
const paymentRoutes = require('./routes/paymentRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/payment', paymentRoutes);

mongoose.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.once('open', () => {
    console.log('E-LEARN-PAYMENT_SERVICE-DB is connected successfully');
    app.listen(PORT, () => {
        console.log(`PAYMENT_SERVICE_IS_LISTENING_ON_PORT: ${PORT}`);
    });
});
