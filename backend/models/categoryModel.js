module.exports.createCategoryTable = async function (pool) {
  try {
    // Create the categories table with parent_id for hierarchy
    const categoriesQuery = `CREATE TABLE IF NOT EXISTS categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            parent_id INT NULL,
            description TEXT NULL,
            image_url VARCHAR(255) NULL,
            slug VARCHAR(255) NULL UNIQUE,
            is_featured BOOLEAN DEFAULT FALSE,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE
            ) ENGINE=InnoDB`; // Explicitly set InnoDB engine

    await pool.query(categoriesQuery);
    console.log('Created categories table');
  } catch (error) {
    console.error('Error creating categories table:', error.message);
  }
};
