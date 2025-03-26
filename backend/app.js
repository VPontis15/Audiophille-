const express = require('express');
const cors = require('cors');
const pool = require('./config/config');
const app = express();
const fs = require('fs');
const productRouter = require('./routes/productRoutes');

let products = fs.readFileSync('./data.json', 'utf-8');
products = JSON.parse(products);

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/v1/products', productRouter);

module.exports = app;
