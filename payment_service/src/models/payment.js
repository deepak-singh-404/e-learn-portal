const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    requestId: { type: String, required: true, unique: true },
    userId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;