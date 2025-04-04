const express = require('express');
const {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productsController');

const productRouter = express.Router();

// Routes
productRouter.route('/').get(getAllProducts).post(createProduct);
productRouter
  .route('/:slug')
  .get(getProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

module.exports = productRouter;
