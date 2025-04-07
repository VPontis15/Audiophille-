module.exports.createProductTable = async function (pool) {
  try {
    const query = `CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(13, 2) NOT NULL,
        status ENUM('published', 'draft') NOT NULL,
        gallery JSON NOT NULL,
        quantity INT NOT NULL,
        rating DECIMAL(2, 1) NOT NULL,
        slug VARCHAR(100) NOT NULL UNIQUE,
        collection VARCHAR(100) NOT NULL,
        isFeatured BOOLEAN DEFAULT FALSE,
        featuredImage JSON,
        isNewArrival BOOLEAN DEFAULT FALSE,
        isBestSeller BOOLEAN DEFAULT FALSE,
        isOnSale BOOLEAN DEFAULT FALSE,
        salePrice DECIMAL(13, 2),
        saleEndDate DATE,
        relatedProducts JSON, 
        packageContents JSON,
        categoryId INT NOT NULL,
        brandId INT NOT NULL,
        numReviews INT  NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE,
        FOREIGN KEY (brandId) REFERENCES brands(id) ON DELETE CASCADE,
        INDEX (name),
      
        INDEX (slug)
        ) ENGINE=InnoDB`;

    await pool.query(query);
    console.log('Created products table');
  } catch (error) {
    console.error('Error creating products table:', error);
  }
};
