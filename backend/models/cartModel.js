module.exports.createCartTable = async function (pool) {
  try {
    // Create carts table first
    const cartQuery = `CREATE TABLE IF NOT EXISTS carts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,             
                FOREIGN KEY (userId) REFERENCES users(id)
                )`;

    await pool.query(cartQuery);
    console.log('Created carts table');

    // Then create cartItems table
    const cartItemsQuery = `CREATE TABLE IF NOT EXISTS cartItems (
                id INT AUTO_INCREMENT PRIMARY KEY,
                cartId INT NOT NULL,
                productId INT NOT NULL,
                quantity INT NOT NULL DEFAULT 1,
                price DECIMAL(10, 2) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,             
                UNIQUE (cartId, productId),
                CHECK (quantity > 0),
                FOREIGN KEY (cartId) REFERENCES carts(id) ON DELETE CASCADE,
                FOREIGN KEY (productId) REFERENCES products(id)
                )`;

    await pool.query(cartItemsQuery);
    console.log('Created cartItems table');
  } catch (error) {
    console.error('Error creating cart tables:', error);
  }
};
