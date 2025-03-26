module.exports.createOrderTable = async function (pool) {
  try {
    const query = `CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId INT NOT NULL,
                status ENUM('pending', 'processing', 'shipped', 'delivered') NOT NULL DEFAULT 'pending',
                paymentMethod ENUM('viva', 'stripe', 'cash','paypal') NOT NULL,
                paymentResult TEXT,
                tax DECIMAL(13, 2) NOT NULL,
                shipping DECIMAL(13, 2) NOT NULL,
                total DECIMAL(13, 2) NOT NULL,
                paid BOOLEAN NOT NULL DEFAULT FALSE,
                paidAt TIMESTAMP,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userId) REFERENCES users(id)
                )`;

    await pool.query(query);
    console.log('Created orders table');
  } catch (error) {
    console.error('Error creating orders table:', error);
  }
};
