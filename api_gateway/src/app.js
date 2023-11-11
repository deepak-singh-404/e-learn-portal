const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('dev'));

let restream = function (proxyReq, req, res, options) {
    if (req.body) {
        let bodyData = JSON.stringify(req.body);
        // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        // stream the content
        proxyReq.write(bodyData);
    }
}


// Proxy middleware for various services
const authProxy = createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
    timeout: 5000,
    pathRewrite: { '^/api/gateway/auth': '/api/auth' },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    onProxyReq: restream
});

const courseProxy = createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    timeout: 5000,
    pathRewrite: { '^/api/gateway/courses': '/api/courses' },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    onProxyReq: restream
});

const searchProxy = createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
    timeout: 5000,
    pathRewrite: { '^/api/gateway/search': '/api/search' },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    onProxyReq: restream
});

const cartProxy = createProxyMiddleware({
    target: 'http://localhost:3004',
    changeOrigin: true,
    timeout: 5000,
    pathRewrite: { '^/api/gateway/cart': '/api/cart' },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    onProxyReq: restream
});

const paymentProxy = createProxyMiddleware({
    target: 'http://localhost:3003',
    changeOrigin: true,
    timeout: 5000,
    pathRewrite: { '^/api/gateway/payment': '/api/payment' },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    onProxyReq: restream
});

const feedbackProxy = createProxyMiddleware({
    target: 'http://localhost:3005',
    changeOrigin: true,
    timeout: 5000,
    pathRewrite: { '^/api/gateway/feedback': '/api/feedback' },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    onProxyReq: restream
});

const verifyUserAuthToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization']
        if (!token) {
            res.status(400).json({ status: false, message: "Token is missing." })
            return
        }
        const { data } = await axios({
            "method": "Get",
            "url": `http://localhost:3000/api/auth/verify/token?token=${token}`
        })
        if (!data.status) {
            res.status(401).json({ status: false, message: 'Unauthorized' })
        }
        next()
    }
    catch (err) {
        console.log(err)
        res.status(401).json({ status: false, message: 'Unautenticated request' })
    }
}

// Use the proxies for respective paths
app.use('/api/gateway/auth', authProxy);
app.use(verifyUserAuthToken)
app.use('/api/gateway/courses', courseProxy);
app.use('/api/gateway/search', searchProxy);
app.use('/api/gateway/cart', cartProxy);
app.use('/api/gateway/payment', paymentProxy);
app.use('/api/gateway/feedback', feedbackProxy);

app.listen(PORT, () => {
    console.log(`API GATEWAY IS LISTENING ON PORT: ${PORT}`);
});
