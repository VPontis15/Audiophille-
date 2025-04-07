const { pool } = require('../config/config');

exports.getAllBrands = async function (req, res) {
  try {
    // Initialize parameters for SQL query
    let sqlParams = [];
    let sqlQuery = 'SELECT * FROM brands';

    // 1) FILTERING
    const filterableFields = ['name', 'country', 'isPopular'];
    const filterConditions = [];

    // Process query parameters for filtering
    Object.keys(req.query).forEach((key) => {
      // Skip pagination, sorting and fields parameters
      if (['page', 'limit', 'sort', 'fields'].includes(key)) return;

      // Handle basic equality filters
      if (filterableFields.includes(key)) {
        // Handle isPopular as boolean
        if (key === 'isPopular') {
          const boolValue = req.query[key].toLowerCase() === 'true' ? 1 : 0;
          filterConditions.push(`${key} = ?`);
          sqlParams.push(boolValue);
        }
        // Handle text search with LIKE operator
        else if (typeof req.query[key] === 'object' && req.query[key].like) {
          filterConditions.push(`${key} LIKE ?`);
          sqlParams.push(`%${req.query[key].like}%`);
        }
        // Handle exact equality
        else {
          filterConditions.push(`${key} = ?`);
          sqlParams.push(req.query[key]);
        }
      }
    });

    // Add WHERE clause if we have any filter conditions
    if (filterConditions.length > 0) {
      sqlQuery += ' WHERE ' + filterConditions.join(' AND ');
    }

    // 2) SORTING
    if (req.query.sort) {
      const sortFields = req.query.sort.split(',');
      const sortClauses = sortFields.map((field) => {
        // Handle descending sort with negative sign
        if (field.startsWith('-')) {
          return `${field.substring(1)} DESC`;
        }
        return `${field} ASC`;
      });

      sqlQuery += ' ORDER BY ' + sortClauses.join(', ');
    } else {
      // Default sort
      sqlQuery += ' ORDER BY createdAt DESC';
    }

    // 3) PAGINATION
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    // Get total count for pagination metadata
    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM brands' +
        (filterConditions.length > 0
          ? ' WHERE ' + filterConditions.join(' AND ')
          : ''),
      sqlParams.slice()
    );

    const totalBrands = countResult[0].total;
    const totalPages = Math.ceil(totalBrands / limit);

    // Add pagination to query
    sqlQuery += ' LIMIT ? OFFSET ?';
    sqlParams.push(limit, offset);

    // Execute the main query
    const [brands] = await pool.execute(sqlQuery, sqlParams);

    // 4) FIELD SELECTION
    if (req.query.fields) {
      const fields = req.query.fields.split(',');
      const validFields = [
        'id',
        'name',
        'description',
        'country',
        'isPopular',
        'logo',
        'website',
        'createdAt',
        'updatedAt',
      ];

      // Filter brands to only include requested fields
      const filteredBrands = brands.map((brand) => {
        const filteredBrand = {};
        fields.forEach((field) => {
          if (validFields.includes(field)) {
            filteredBrand[field] = brand[field];
          }
        });
        return filteredBrand;
      });

      // Return filtered response
      return res.status(200).json({
        status: 'success',
        results: filteredBrands.length,
        totalBrands,
        totalPages,
        currentPage: page,
        data: {
          brands: filteredBrands,
        },
        pagination: {
          total: totalBrands,
          pages: totalPages,
          page,
          limit,
        },
      });
    }

    // Return full response if no field filtering
    res.status(200).json({
      status: 'success',
      results: brands.length,
      totalBrands,
      totalPages,
      currentPage: page,
      data: {
        brands,
      },
      pagination: {
        total: totalBrands,
        pages: totalPages,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.getBrand = async function (req, res) {
  try {
    // Handle field selection
    let fields = '*';
    if (req.query.fields) {
      const requestedFields = req.query.fields.split(',');
      const validFields = [
        'id',
        'name',
        'description',
        'country',
        'isPopular',
        'logo',
        'website',
        'createdAt',
        'updatedAt',
      ];
      const safeFields = requestedFields.filter((field) =>
        validFields.includes(field)
      );

      if (safeFields.length > 0) {
        // Always include id field
        if (!safeFields.includes('id')) {
          safeFields.unshift('id');
        }
        fields = safeFields.join(', ');
      }
    }

    const [brand] = await pool.execute(
      `SELECT ${fields} FROM brands WHERE id = ?`,
      [req.params.id]
    );

    if (brand.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Brand not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        brand: brand[0],
      },
    });
  } catch (error) {
    console.error('Error fetching brand:', error);
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.createBrand = async function (req, res) {
  try {
    // Extract all possible fields from request body
    const {
      name,
      description = null,
      country = null,
      isPopular = false,
      logo = null,
      website = null,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        status: 'fail',
        message: 'Brand name is required',
      });
    }

    // Build query dynamically based on provided fields
    const fields = ['name'];
    const values = [name];
    const placeholders = ['?'];

    // Add optional fields if provided
    if (description !== undefined) {
      fields.push('description');
      values.push(description);
      placeholders.push('?');
    }

    if (country !== undefined) {
      fields.push('country');
      values.push(country);
      placeholders.push('?');
    }

    if (isPopular !== undefined) {
      fields.push('isPopular');
      values.push(isPopular ? 1 : 0);
      placeholders.push('?');
    }

    if (logo !== undefined) {
      fields.push('logo');
      values.push(logo);
      placeholders.push('?');
    }

    if (website !== undefined) {
      fields.push('website');
      values.push(website);
      placeholders.push('?');
    }

    const query = `INSERT INTO brands (${fields.join(
      ', '
    )}) VALUES (${placeholders.join(', ')})`;

    const [result] = await pool.execute(query, values);

    // Return created brand with all provided fields
    res.status(201).json({
      status: 'success',
      data: {
        brand: {
          id: result.insertId,
          name,
          description,
          country,
          isPopular,
          logo,
          website,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    });
  } catch (error) {
    console.error('Error creating brand:', error);
    // Handle duplicate entry error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        status: 'fail',
        message: 'A brand with this name already exists',
      });
    }

    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.updateBrand = async function (req, res) {
  try {
    // Get current brand to know what fields to update
    const [currentBrand] = await pool.execute(
      'SELECT * FROM brands WHERE id = ?',
      [req.params.id]
    );

    if (currentBrand.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Brand not found',
      });
    }

    // Extract fields from request body
    const updates = { ...req.body };

    // Build SET clause and parameters dynamically
    const setClause = [];
    const values = [];

    Object.keys(updates).forEach((key) => {
      // Only allow updating certain fields
      if (
        [
          'name',
          'description',
          'country',
          'isPopular',
          'logo',
          'website',
        ].includes(key)
      ) {
        // Handle boolean conversion for isPopular
        if (key === 'isPopular') {
          setClause.push(`${key} = ?`);
          values.push(updates[key] ? 1 : 0);
        } else {
          setClause.push(`${key} = ?`);
          values.push(updates[key]);
        }
      }
    });

    // If no valid fields to update
    if (setClause.length === 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'No valid fields to update',
      });
    }

    // Add ID for WHERE clause
    values.push(req.params.id);

    const query = `UPDATE brands SET ${setClause.join(', ')} WHERE id = ?`;
    const [result] = await pool.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Brand not found',
      });
    }

    // Get updated brand
    const [updatedBrand] = await pool.execute(
      'SELECT * FROM brands WHERE id = ?',
      [req.params.id]
    );

    res.status(200).json({
      status: 'success',
      data: {
        brand: updatedBrand[0],
      },
    });
  } catch (error) {
    console.error('Error updating brand:', error);
    // Handle duplicate entry error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        status: 'fail',
        message: 'A brand with this name already exists',
      });
    }

    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.deleteBrand = async function (req, res) {
  try {
    const [result] = await pool.execute('DELETE FROM brands WHERE id = ?', [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Brand not found',
      });
    }

    // Return 204 No Content for successful deletion
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting brand:', error);
    // Handle foreign key constraint error
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({
        status: 'fail',
        message:
          'Cannot delete this brand because it is referenced by other records',
      });
    }

    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};
