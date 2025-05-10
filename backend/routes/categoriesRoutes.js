const express = require('express');
const categoryRoute = express.Router();

const {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryHierarchy,
} = require('../controllers/categoriesController');
categoryRoute.route('/hierarchy').get(getCategoryHierarchy);

categoryRoute.route('/').get(getAllCategories).post(createCategory);
categoryRoute
  .route('/:slug')
  .get(getCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

module.exports = categoryRoute;
