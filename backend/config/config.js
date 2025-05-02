const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables based on NODE_ENV
const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.development';

console.log(`Loading environment from ${envFile}`);
dotenv.config({ path: path.resolve(__dirname, '..', envFile) });

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
    // First verify the database connection
    console.log('Testing database connection...');
    try {
      await pool.query('SELECT 1');
      console.log('Database connection successful!');
    } catch (error) {
      console.error('Database connection failed:', error.message);
      throw error;
    }

    await brandModel.createBrandTable(pool);
    await categoryModel.createCategoryTable(pool);
    await productModel.createProductTable(pool);
    await userModel.createUserTable(pool);
    await orderModel.createOrderTable(pool);
    await cartModel.createCartTable(pool);

    console.log('All tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

module.exports = {
  pool,
  createTables,
};
