module.exports.createCartTable = async function (pool) {
  try {
    // Check if the required tables exist first
    const checkTables = `
      SELECT COUNT(*) as count FROM information_schema.tables 
      WHERE table_schema = DATABASE() 
      AND table_name IN ('users', 'products')
    `;

    const [tablesResult] = await pool.query(checkTables);
    if (tablesResult[0].count < 2) {
      console.error(
        'Users and products tables must exist before creating cart tables'
      );
      return;
    }

    // Create carts table first
    const cartQuery = `CREATE TABLE IF NOT EXISTS carts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
                ) ENGINE=InnoDB`; // Explicitly set InnoDB engine

    await pool.query(cartQuery);
    console.log('Created carts table');

    // Verify carts table was created
    const [cartTableExists] = await pool.query(`
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = DATABASE() AND table_name = 'carts'
    `);

    if (cartTableExists.length === 0) {
      throw new Error('Failed to create carts table');
    }

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
                FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
                ) ENGINE=InnoDB`; // Explicitly set InnoDB engine

    await pool.query(cartItemsQuery);
    console.log('Created cartItems table');
  } catch (error) {
    console.error('Error creating cart tables:', error);
    throw error; // Re-throw to ensure proper error propagation
  }
};
