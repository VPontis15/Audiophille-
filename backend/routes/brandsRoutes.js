const express = require('express');
const brandRouter = express.Router();

const {
  getAllBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} = require('../controllers/brandsController');

brandRouter.route('/').get(getAllBrands).post(createBrand);
brandRouter
  .route('/:slug')
  .get(getBrand)
  .patch(updateBrand)
  .delete(deleteBrand);

module.exports = brandRouter;
