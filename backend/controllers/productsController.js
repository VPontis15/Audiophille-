const fs = require('fs');
const pool = require('../config/config');

exports.getAllProducts = async (req, res) => {
  try {
    const [products] = await pool.execute('SELECT * FROM products');

    res.status(200).json({
      status: 'Success',
      results: products.length,
      products,
    });
  } catch (error) {
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
    const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [
      req.params.id,
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
