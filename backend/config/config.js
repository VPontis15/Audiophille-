const mysql = require('mysql2/promise');
require('dotenv').config();
const brandModel = require('../models/brandModel');
const categoryModel = require('../models/categoryModel');
const productModel = require('../models/productModel');
const userModel = require('../models/userModel');
const orderModel = require('../models/orderModel');
const cartModel = require('../models/cartModel');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Creates all database tables for the application.
 *
 * This function attempts to create the following tables in sequence:
 * - Brand table
 * - Category table
 * - Product table
 * - User table
 * - Order table
 * - Cart table
 *
 * If any table creation fails, an error is logged to the console.
 *
 * @async
 * @function createTables
 * @returns {Promise<void>} A promise that resolves when all tables are created successfully.
 * @throws {Error} If any table creation fails.
 */
async function createTables() {
  try {
    await brandModel.createBrandTable(pool);
    await categoryModel.createCategoryTable(pool);
    await productModel.createProductTable(pool);
    await userModel.createUserTable(pool);
    await orderModel.createOrderTable(pool);
    await cartModel.createCartTable(pool);

    console.log('All tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

module.exports = {
  pool,
  createTables,
};
