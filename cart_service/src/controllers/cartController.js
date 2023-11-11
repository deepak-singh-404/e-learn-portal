const Cart = require('../models/cart');

const addToCart = async (req, res) => {
    try {
        const { userId, courseId, quantity } = req.body;

        // Check if the course is already in the user's cart
        const existingCartItem = await Cart.findOne({ userId, courseId });

        if (existingCartItem) {
            // If the course is already in the cart, update the quantity
            existingCartItem.quantity += quantity || 1; // Default to 1 if quantity is not provided
            await existingCartItem.save();
        } else {
            // If the course is not in the cart, add it
            const cartItem = new Cart({ userId, courseId, quantity });
            await cartItem.save();
        }

        const userCart = await Cart.find({ userId })

        res.status(200).json({ status: true, message: 'Course added to the cart successfully', data: userCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
}

const getCartOfUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        // Retrieve the user's cart
        const userCart = await Cart.find({ userId });

        res.status(200).json({ status: true, message: "Fetched successfully", data: userCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = { addToCart, getCartOfUser }