module.exports.createProductTable = async function (pool) {
  try {
    const query = `CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(13, 2) NOT NULL,
        image VARCHAR(255) NOT NULL,
        brand VARCHAR(100) NOT NULL,
        category VARCHAR(100) NOT NULL,
        countInStock INT NOT NULL,
        rating DECIMAL(2, 1) NOT NULL,
        numReviews INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

    await pool.query(query);
    console.log('Created products table');
  } catch (error) {
    console.error('Error creating products table:', error);
  }
};
