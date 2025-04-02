module.exports.createOrderTable = async function (pool) {
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
        'Users and products tables must exist before creating orders tables'
      );
      return;
    }

    // Create the orders table first
    const ordersQuery = `CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            userId INT NOT NULL,
            shippingAddress TEXT NOT NULL,
            paymentMethod VARCHAR(50) NOT NULL,
            itemsPrice DECIMAL(10, 2) NOT NULL,
            shippingPrice DECIMAL(10, 2) NOT NULL,
            taxPrice DECIMAL(10, 2) NOT NULL,
            totalPrice DECIMAL(10, 2) NOT NULL,
            isPaid BOOLEAN DEFAULT FALSE,
            paidAt TIMESTAMP NULL,
            status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
            deliveredAt TIMESTAMP NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
            INDEX (userId),
            INDEX (status)
            ) ENGINE=InnoDB`; // Explicitly set InnoDB engine

    await pool.query(ordersQuery);
    console.log('Created orders table');

    // Then check if orders table was successfully created
    const [orderTableExists] = await pool.query(`
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = DATABASE() AND table_name = 'orders'
    `);

    if (orderTableExists.length === 0) {
      throw new Error('Failed to create orders table');
    }

    // Check the column types to ensure compatibility
    const [productIdInfo] = await pool.query(`
      SELECT COLUMN_NAME, DATA_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'products' 
      AND COLUMN_NAME = 'id'
    `);

    if (!productIdInfo.length) {
      throw new Error('Product id column not found');
    }

    // Now create the orderItems table
    // Fixed the productId reference
    const orderItemsQuery = `CREATE TABLE IF NOT EXISTS orderItems (
            id INT AUTO_INCREMENT PRIMARY KEY,
            orderId INT NOT NULL,
            productId INT NOT NULL,
            name VARCHAR(100) NOT NULL,
            quantity INT NOT NULL DEFAULT 1,
            price DECIMAL(10, 2) NOT NULL,
            image VARCHAR(255),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
            FOREIGN KEY (productId) REFERENCES products(id),
            INDEX (orderId),
            INDEX (productId)
            ) ENGINE=InnoDB`; // Explicitly set InnoDB engine

    await pool.query(orderItemsQuery);
    console.log('Created orderItems table');
  } catch (error) {
    console.error('Error creating order tables:', error);
    throw error; // Re-throw to ensure proper error propagation
  }
};
