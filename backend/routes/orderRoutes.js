const express = require('express');
const {
  getAllOrders,
  getOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/ordersController');

const orderRouter = express.Router();

// Routes
orderRouter.route('/').get(getAllOrders);
orderRouter.route('/:id').get(getOrder).patch(updateOrder).delete(deleteOrder);

module.exports = orderRouter;
