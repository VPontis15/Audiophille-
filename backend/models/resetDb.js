const { pool } = require('../config/config');

async function resetDb() {
  try {
    await pool.query('DROP DATABASE IF EXISTS audiophille');
  } catch (error) {
    console.error('Error resetting database:', error);
  } finally {
    await pool.end();
  }
}
