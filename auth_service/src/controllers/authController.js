const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the username is already taken
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ status: false, message: 'Username already exists' });
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            password: hashedPassword,
        });

        // Save the user to the database
        const user = await newUser.save();

        res.status(201).json({ status: true, message: 'User registered successfully', data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ status: false, message: 'Invalid username or password' });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ status: false, message: 'Invalid username or password' });
        }

        // Generate a JWT token for authentication
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ status: true, message: 'Logged in successfully', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const verifyToken = (req, res) => {
    const token = req.query.token;

    // Check if token is present
    if (!token) {
        return res.status(401).json({ status: false, message: 'Access denied. Token is missing.' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        res.status(200).json({ status: true, data: decodedToken })
    } catch (error) {
        if (error.message === 'jwt expired') {
            return res.status(200).json({ status: false, message: 'Token expired.' })
        }
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};

const fetchUser = async (req, res) => {
    const userId = req.params.userId

    // Check if token is present
    if (!userId) {
        return res.status(400).json({ status: false, message: 'Invalid userid.' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ status: false, message: 'User not found.' })
        }
        res.status(200).json({ status: true, data: user })
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
};

module.exports = { register, login, verifyToken, fetchUser };
