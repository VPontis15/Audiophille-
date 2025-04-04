const { pool } = require('../config/config');

exports.getAllProducts = async (req, res) => {
  try {
    // Initialize parameters for the SQL query
    let sqlParams = [];

    // Start building the base query
    let sqlQuery = 'SELECT * FROM products';

    // Process query parameters for filtering, pagination, sorting
    const query = { ...req.query };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach((field) => delete query[field]);

    // 1) FILTERING
    if (Object.keys(query).length > 0) {
      // Build WHERE clause from query parameters
      const whereClauses = [];

      for (const [key, value] of Object.entries(query)) {
        // Handle special filtering operators (gt, gte, lt, lte, like)
        if (typeof value === 'object' && value !== null) {
          for (const [operator, operand] of Object.entries(value)) {
            let sqlOperator;
            switch (operator) {
              case 'gt':
                sqlOperator = '>';
                break;
              case 'gte':
                sqlOperator = '>=';
                break;
              case 'lt':
                sqlOperator = '<';
                break;
              case 'lte':
                sqlOperator = '<=';
                break;
              case 'like':
                sqlOperator = 'LIKE';
                sqlParams.push(`%${operand}%`);
                break;
              default:
                continue; // Skip unsupported operators
            }

            if (sqlOperator === 'LIKE') {
              whereClauses.push(`${key} ${sqlOperator} ?`);
            } else {
              whereClauses.push(`${key} ${sqlOperator} ?`);
              sqlParams.push(operand);
            }
          }
        }
        // Handle array values (IN operator)
        else if (Array.isArray(value)) {
          const placeholders = value.map(() => '?').join(', ');
          whereClauses.push(`${key} IN (${placeholders})`);
          sqlParams.push(...value);
        }
        // Handle boolean fields
        else if (value === 'true' || value === 'false') {
          whereClauses.push(`${key} = ?`);
          sqlParams.push(value === 'true' ? 1 : 0);
        }
        // Handle regular equality comparison
        else {
          whereClauses.push(`${key} = ?`);
          sqlParams.push(value);
        }
      }

      // Add WHERE clause to the query if we have any conditions
      if (whereClauses.length > 0) {
        sqlQuery += ' WHERE ' + whereClauses.join(' AND ');
      }
    }

    // 2) SORTING
    if (req.query.sort) {
      const sortFields = req.query.sort.split(',').map((field) => {
        // Check if the field starts with - for descending sort
        if (field.startsWith('-')) {
          return `${field.substring(1)} DESC`;
        }
        return `${field} ASC`;
      });

      sqlQuery += ' ORDER BY ' + sortFields.join(', ');
    } else {
      // Default sort by creation date, most recent first
      sqlQuery += ' ORDER BY createdAt DESC';
    }

    // 3) PAGINATION
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    sqlQuery += ' LIMIT ? OFFSET ?';
    sqlParams.push(limit, offset);

    // 4) FIELD LIMITING (we'll handle this after query execution)
    const selectFields = req.query.fields ? req.query.fields.split(',') : null;

    // Execute the query
    const [products] = await pool.execute(sqlQuery, sqlParams);

    // Get total count for pagination
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM products ${
        sqlQuery.includes('WHERE')
          ? sqlQuery.substring(
              sqlQuery.indexOf('WHERE'),
              sqlQuery.includes('ORDER BY')
                ? sqlQuery.indexOf('ORDER BY')
                : sqlQuery.includes('LIMIT')
                ? sqlQuery.indexOf('LIMIT')
                : sqlQuery.length
            )
          : ''
      }`,
      sqlParams.slice(0, sqlQuery.split('?').length - 3) // Remove the limit and offset params
    );

    const totalProducts = countResult[0].total;
    const totalPages = Math.ceil(totalProducts / limit);

    // Apply field limiting if needed
    let formattedProducts = products;
    if (selectFields) {
      formattedProducts = products.map((product) => {
        const filteredProduct = {};
        selectFields.forEach((field) => {
          if (product[field] !== undefined) {
            filteredProduct[field] = product[field];
          }
        });
        return filteredProduct;
      });
    }

    // Respond with the results
    res.status(200).json({
      status: 'Success',
      results: products.length,
      totalProducts,
      totalPages,
      currentPage: page,
      products: formattedProducts,
      pagination: {
        total: totalProducts,
        pages: totalPages,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Unable to retrieve products',
      error: error.message,
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    // Validate request body
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: 'Fail',
        message: 'No product data provided',
      });
    }

    const data = {
      slug: req.body.name.trim().toLowerCase().replace(/ /g, '-'),
      ...req.body,
    };

    // Insert the new product
    const [result] = await pool.execute('INSERT INTO products SET ?', data);
    console.log(result);
    // Respond with created product
    res.status(201).json({
      status: 'Success',
      product: {
        id: result.insertId,
        ...req.body,
        slug: req.body.name.toLowerCase().replace(/ /g, '-'),
      },
    });
  } catch (error) {
    console.error('Error creating product:', error);

    // Handle specific error cases
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        status: 'Fail',
        message: 'A product with this unique identifier already exists',
      });
    }

    // Generic server error
    res.status(500).json({
      status: 'Error',
      message: 'Unable to create product',
      error: error.message,
    });
  }
};
exports.getProduct = async (req, res) => {
  try {
    const [products] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );

    // Check if product exists
    if (products.length === 0) {
      return res.status(404).json({
        status: 'Fail',
        message: `No product found with ID ${req.params.id}`,
      });
    }

    // If product exists, return the first (and typically only) product
    res.status(200).json({
      status: 'Success',
      product: products[0],
    });
  } catch (error) {
    console.error('Error retrieving product:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Unable to retrieve product',
      error: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const [products] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );

    // Check if product exists
    if (products.length === 0) {
      return res
        .status(404)
        .json({ status: 'Fail', message: 'Product not found' });
    }

    const product = products[0];

    // Remove fields that shouldn't be updated
    const updateData = { ...req.body };
    delete updateData.id; // Prevent ID manipulation
    delete updateData.createdAt; // Prevent modifying creation timestamp

    // Merge existing product with update data
    const updatedProduct = { ...product, ...updateData };

    // Perform the update
    await pool.execute('UPDATE products SET ? WHERE id = ?', [
      updateData, // Only send the fields to be updated
      req.params.id,
    ]);

    res.status(200).json({
      status: 'Success',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Unable to update product',
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM products WHERE slug = ?', [
      req.params.slug,
    ]);

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: 'Fail', message: 'Product not found' });
    }

    // 204 No Content is appropriate for successful delete with no response body
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Unable to delete product',
      error: error.message,
    });
  }
};
