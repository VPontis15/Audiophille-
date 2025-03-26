const mysql = require('mysql2/promise');
require('dotenv').config();
const { createProductTable } = require('../models/productModel');
const { createUserTable } = require('../models/userModel');
const { createOrderTable } = require('../models/orderModel');
const { createCartTable } = require('../models/cartModel');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Modify exports to include both pool and createTables
module.exports = {
  pool,
  createTables: async () => {
    try {
      await createProductTable(pool);
      await createUserTable(pool);
      await createOrderTable(pool);
      await createCartTable(pool);

      console.log('All tables created successfully');
    } catch (error) {
      console.error('Error creating tables:', error);
      throw error;
    }
  },
};
