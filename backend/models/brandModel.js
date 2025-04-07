module.exports.createBrandTable = async function (pool) {
  try {
    const query = `CREATE TABLE IF NOT EXISTS brands (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT NULL,
        country VARCHAR(50) NULL,
        isPopular BOOLEAN DEFAULT FALSE,
        slug VARCHAR(255) NOT NULL UNIQUE,
        logo VARCHAR(255) NULL,
        website VARCHAR(255) NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB`;

    await pool.query(query);
    console.log('Created brands table');
  } catch (error) {
    console.error('Error creating brands table:', error);
  }
};
