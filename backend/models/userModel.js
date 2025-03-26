const pool = require('../config/config');

module.exports.createUserTable = async function (pool) {
  try {
    const query = `CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(100) NOT NULL,
            isAdmin BOOLEAN DEFAULT FALSE,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`;

    await pool.query(query);
    console.log('Created users table');
  } catch (error) {
    console.error('Error creating users table:', error);
  }
};
