const express = require('express');
const cors = require('cors');
const app = express();
const productRouter = require('./routes/productRoutes');
const orderRouter = require('./routes/orderRoutes');
const categoryRouter = require('./routes/categoriesRoutes');
const brandRouter = require('./routes/brandsRoutes');
// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/brands', brandRouter);
module.exports = app;
