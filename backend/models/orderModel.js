module.exports.createOrderTable = async function (pool) {
  try {
    const query = `CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT,
                guestEmail VARCHAR(255),
                status ENUM('pending', 'processing', 'shipped', 'delivered') NOT NULL DEFAULT 'pending',
                paymentMethod ENUM('viva', 'stripe', 'cash','paypal') NOT NULL,
                paymentResult TEXT,
                tax DECIMAL(13, 2) NOT NULL,
                shipping DECIMAL(13, 2) NOT NULL,
                total DECIMAL(13, 2) NOT NULL,
                isPaid BOOLEAN NOT NULL DEFAULT FALSE,
                isDelivered BOOLEAN NOT NULL DEFAULT FALSE,
                deliveredAt TIMESTAMP NULL DEFAULT NULL,
                itemsPrice DECIMAL(13, 2) NOT NULL,
                shippingAddress TEXT,
                orderItems JSON NOT NULL,
                itemsCount INT NOT NULL,
                paidAt TIMESTAMP NULL DEFAULT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
                )`;

    await pool.query(query);
    console.log('Created orders table');
  } catch (error) {
    console.error('Error creating orders table:', error);
  }
};
