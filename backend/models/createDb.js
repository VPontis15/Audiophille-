// create db audiophille

const { pool } = require('../config/config');

const createDb = async () => {
  try {
    await pool.query('CREATE DATABASE IF NOT EXISTS audiophille');
    console.log('Database created or already exists');
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    await pool.end();
  }
};
