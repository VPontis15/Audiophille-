const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const productRouter = require('./routes/productRoutes');
const orderRouter = require('./routes/orderRoutes');
const categoryRouter = require('./routes/categoriesRoutes');
const brandRouter = require('./routes/brandsRoutes');
const createPaymentOrderRouter = require('./routes/createPaymentOrderRouter');

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/brands', brandRouter);
app.use('/api/v1/payment', createPaymentOrderRouter);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  console.log('Running in production mode - serving static assets');

  // Serve static files from the public directory (React build)
  app.use(express.static(path.join(__dirname, 'public')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    // Skip API routes
    if (!req.url.startsWith('/api/')) {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
  });
}

module.exports = app;
