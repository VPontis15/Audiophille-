module.exports.createCartTable = async function (pool) {
  try {
    const query = `CREATE TABLE IF NOT EXISTS cart (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT NOT NULL,
                productId INT NOT NULL,
                quantity INT NOT NULL,
                FOREIGN KEY (userId) REFERENCES users(id),
                FOREIGN KEY (productId) REFERENCES products(id)
                )`;

    await pool.query(query);
    console.log('Created cart table');
  } catch (error) {
    console.error('Error creating cart table:', error);
  }
};
