const express = require('express');
const cors = require('cors');
const pool = require('./config/config');
const app = express();
const fs = require('fs');
const productRouter = require('./routes/productRoutes');
const orderRouter = require('./routes/orderRoutes');

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);
module.exports = app;
