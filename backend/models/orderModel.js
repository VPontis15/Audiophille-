module.exports.createOrderTable = async function (pool) {
  try {
    // Create orders table
    const orderQuery = `CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            userId INT NOT NULL,
            orderItems TEXT NOT NULL,
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
            FOREIGN KEY (userId) REFERENCES users(id)
            )`;

    await pool.query(orderQuery);
    console.log('Created orders table');

    // Create orderItems table for detailed order items
    const orderItemsQuery = `CREATE TABLE IF NOT EXISTS orderItems (
            id INT AUTO_INCREMENT PRIMARY KEY,
            orderId INT NOT NULL,
            productId INT NOT NULL,
            quantity INT NOT NULL DEFAULT 1,
            price DECIMAL(10, 2) NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
            FOREIGN KEY (productId) REFERENCES products(id)
            )`;

    await pool.query(orderItemsQuery);
    console.log('Created orderItems table');
  } catch (error) {
    console.error('Error creating order tables:', error);
  }
};
