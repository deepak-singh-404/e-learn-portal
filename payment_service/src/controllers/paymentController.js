const Payment = require('../models/payment');

const proccessPayment = async (req, res) => {
    try {
        const { requestId, userId, amount, currency, paymentMethod, description } = req.body;

        // Check if the requestId, cartId, and userId are unique
        const isUnique = await Payment.findOne({ $or: [{ requestId }, { userId }] });

        if (isUnique) {
            return res.status(400).json({ message: 'Non-unique identifiers provided' });
        }

        // Store payment data in MongoDB
        const payment = new Payment({
            requestId,
            userId,
            amount,
            currency,
            paymentMethod,
            description,
        });

        await payment.save();

        res.status(200).json({ status: true, message: 'Payment processed successfully', payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
}


module.exports = { proccessPayment }