const { pool } = require('../config/config');

exports.getAllCategories = async (req, res) => {
  try {
    // Check if hierarchy is requested
    const includeHierarchy = req.query.hierarchy === 'true';

    // If hierarchy is requested, use a different approach
    if (includeHierarchy) {
      console.log('Hierarchy requested, fetching parent categories');
      const [parentCategories] = await pool.execute(
        'SELECT * FROM categories WHERE parent_id IS NULL'
      );
      console.log('Found parent categories:', parentCategories.length);

      const hierarchicalCategories = [];

      for (const parent of parentCategories) {
        console.log(`Fetching children for parent ${parent.id}`);
        const [children] = await pool.execute(
          'SELECT * FROM categories WHERE parent_id = ?',
          [parent.id]
        );
        console.log(
          `Found ${children.length} children for parent ${parent.id}`
        );

        hierarchicalCategories.push({
          ...parent,
          subcategories: children || [],
        });
      }

      console.log(
        'Final hierarchical structure:',
        JSON.stringify(hierarchicalCategories, null, 2)
      );

      // Apply field selection if requested
      let formattedCategories = hierarchicalCategories;
      if (req.query.fields) {
        const selectFields = req.query.fields.split(',');
        formattedCategories = hierarchicalCategories.map((category) => {
          const filteredCategory = {};
          selectFields.forEach((field) => {
            if (field === 'subcategories') {
              filteredCategory.subcategories = category.subcategories.map(
                (sub) => {
                  const filteredSub = {};
                  selectFields.forEach((subField) => {
                    if (
                      subField !== 'subcategories' &&
                      sub[subField] !== undefined
                    ) {
                      filteredSub[subField] = sub[subField];
                    }
                  });
                  return filteredSub;
                }
              );
            } else if (category[field] !== undefined) {
              filteredCategory[field] = category[field];
            }
          });
          return filteredCategory;
        });
      }

      return res.status(200).json({
        status: 'success',
        data: {
          results: formattedCategories.length,
          categories: formattedCategories,
          totalPages: 1,
          currentPage: 1,
        },
      });
    }

    // Regular flat categories with filtering, pagination, etc.
    let sqlParams = [];
    let baseQuery = 'SELECT * FROM categories';

    const query = { ...req.query };
    const excludedFields = ['page', 'limit', 'sort', 'fields', 'hierarchy'];
    excludedFields.forEach((field) => delete query[field]);

    // Filtering
    if (Object.keys(query).length > 0) {
      const whereClauses = [];
      for (const [key, value] of Object.entries(query)) {
        if (typeof value === 'object' && value !== null) {
          for (const [operator, operand] of Object.entries(value)) {
            const sqlOperator = {
              gt: '>',
              gte: '>=',
              lt: '<',
              lte: '<=',
              like: 'LIKE',
            }[operator];
            if (sqlOperator) {
              whereClauses.push(`${key} ${sqlOperator} ?`);
              sqlParams.push(sqlOperator === 'LIKE' ? `%${operand}%` : operand);
            }
          }
        } else if (Array.isArray(value)) {
          const placeholders = value.map(() => '?').join(', ');
          whereClauses.push(`${key} IN (${placeholders})`);
          sqlParams.push(...value);
        } else {
          whereClauses.push(`${key} = ?`);
          sqlParams.push(value);
        }
      }
      if (whereClauses.length > 0)
        baseQuery += ' WHERE ' + whereClauses.join(' AND ');
    }

    // Sorting
    let sortClause = req.query.sort
      ? ' ORDER BY ' +
        req.query.sort
          .split(',')
          .map(
            (field) =>
              `${field.replace('-', '')} ${
                field.startsWith('-') ? 'DESC' : 'ASC'
              }`
          )
          .join(', ')
      : ' ORDER BY id ASC';

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const countQuery = baseQuery.replace('*', 'COUNT(*) as total');
    const finalQuery = baseQuery + sortClause + ' LIMIT ? OFFSET ?';
    const paginationParams = [...sqlParams, limit, offset];

    const [countResult] = await pool.execute(countQuery, sqlParams);
    const [categories] = await pool.execute(finalQuery, paginationParams);

    const totalCategories = countResult[0].total;
    const totalPages = Math.ceil(totalCategories / limit);

    // Field Selection
    let formattedCategories = categories;
    if (req.query.fields) {
      const selectFields = req.query.fields.split(',');
      formattedCategories = categories.map((category) => {
        const filteredCategory = {};
        selectFields.forEach((field) => {
          if (category[field] !== undefined)
            filteredCategory[field] = category[field];
        });
        return filteredCategory;
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        results: categories.length,
        categories: formattedCategories,
        totalPages,
        currentPage: page,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const [category] = await pool.execute(
      'SELECT * FROM categories WHERE id = ?',
      [req.params.id]
    );
    if (category.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Category not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        category: category[0],
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        status: 'fail',
        message: 'Category name is required',
      });
    }
    const [result] = await pool.execute(
      'INSERT INTO categories (name) VALUES (?)',
      [name]
    );
    res.status(201).json({
      status: 'success',
      data: {
        category: { id: result.insertId, name },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        status: 'fail',
        message: 'Category name is required',
      });
    }
    const [result] = await pool.execute(
      'UPDATE categories SET name = ? WHERE id = ?',
      [name, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Category not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        category: { id: req.params.id, name },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM categories WHERE slug = ?',
      [req.params.slug]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Category not found',
      });
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.getCategoryProducts = async (req, res) => {
  try {
    const [products] = await pool.execute(
      'SELECT products.* FROM products INNER JOIN categories ON products.categoryId = categories.id WHERE categories.id = ?',
      [req.params.id]
    );
    if (products.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No products found for this category',
      });
    }
    res.status(200).json({
      status: 'success',
      results: products.length,
      data: {
        products,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.getCategoryHierarchy = async (req, res) => {
  try {
    // First, check if we can get ANY data from the categories table
    const [categoryCount] = await pool.execute(
      'SELECT COUNT(*) as count FROM categories'
    );

    if (categoryCount[0].count === 0) {
      console.log('No categories found in database');
      return res.status(200).json({
        status: 'success',
        data: {
          categories: [],
        },
      });
    }

    // Try a simpler query first
    const [simpleCategories] = await pool.execute('SELECT * FROM categories');

    // Now try the hierarchical query
    const [results] = await pool.execute(`
      SELECT 
          parent.id AS parent_id, 
          parent.name AS parent_name,
          parent.slug AS parent_slug,
          child.id AS child_id, 
          child.name AS child_name,
          child.slug AS child_slug
      FROM 
          categories AS parent
      LEFT JOIN 
          categories AS child ON child.parent_id = parent.id
      WHERE 
          parent.parent_id IS NULL
      ORDER BY 
          parent.name, child.name
    `);

    // Handle case when no parent categories exist
    if (results.length === 0) {
      return res.status(200).json({
        status: 'success',
        data: {
          categories: [],
        },
      });
    }

    // Process the flat result into a hierarchical structure
    const parentMap = new Map();

    // First pass: create parent categories
    results.forEach((row) => {
      if (!parentMap.has(row.parent_id)) {
        parentMap.set(row.parent_id, {
          id: row.parent_id,
          name: row.parent_name,
          slug: row.parent_slug,
          subcategories: [],
        });
      }

      // Add child category if it exists
      if (row.child_id) {
        console.log('Adding child:', row.child_id, 'to parent:', row.parent_id);
        parentMap.get(row.parent_id).subcategories.push({
          id: row.child_id,
          name: row.child_name,
          slug: row.child_slug,
        });
      }
    });

    const categoryHierarchy = Array.from(parentMap.values());

    return res.status(200).json({
      status: 'success',
      data: {
        categories: categoryHierarchy,
      },
    });
  } catch (error) {
    console.error('Error in getCategoryHierarchy:', error);
    return res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};
