const { pool } = require('../config/config');

exports.getAllOrders = async (req, res) => {
  try {
    let sqlParams = [];
    let baseQuery =
      "SELECT orders.*, users.name, users.phone, users.email FROM orders INNER JOIN users ON orders.userId = users.id WHERE orders.status != 'processing'";

    const query = { ...req.query };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach((field) => delete query[field]);

    // Filtering
    if (Object.keys(query).length > 0) {
      const whereClauses = [];
      for (const [key, value] of Object.entries(query)) {
        const tablePrefix = ['name', 'phone', 'email'].includes(key)
          ? 'users.'
          : 'orders.';
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
              whereClauses.push(`${tablePrefix}${key} ${sqlOperator} ?`);
              sqlParams.push(sqlOperator === 'LIKE' ? `%${operand}%` : operand);
            }
          }
        } else if (Array.isArray(value)) {
          const placeholders = value.map(() => '?').join(', ');
          whereClauses.push(`${tablePrefix}${key} IN (${placeholders})`);
          sqlParams.push(...value);
        } else {
          whereClauses.push(`${tablePrefix}${key} = ?`);
          sqlParams.push(value);
        }
      }
      if (whereClauses.length > 0)
        baseQuery += ' AND ' + whereClauses.join(' AND '); // Changed 'WHERE' to 'AND'
    }

    // Sorting
    let sortClause = req.query.sort
      ? ' ORDER BY ' +
        req.query.sort
          .split(',')
          .map((field) => {
            const tablePrefix = ['name', 'phone', 'email'].includes(
              field.replace('-', '')
            )
              ? 'users.'
              : 'orders.';
            return `${tablePrefix}${field.replace('-', '')} ${
              field.startsWith('-') ? 'DESC' : 'ASC'
            }`;
          })
          .join(', ')
      : ' ORDER BY orders.createdAt DESC';

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const countQuery = baseQuery.replace(
      'orders.*, users.name, users.phone, users.email',
      'COUNT(*) as total'
    );
    const finalQuery = baseQuery + sortClause + ' LIMIT ? OFFSET ?';
    const paginationParams = [...sqlParams, limit, offset];

    const [countResult] = await pool.execute(countQuery, sqlParams);
    const [orders] = await pool.execute(finalQuery, paginationParams);

    const totalOrders = countResult[0].total;
    const totalPages = Math.ceil(totalOrders / limit);

    // Field Selection
    let formattedOrders = orders;
    if (req.query.fields) {
      const selectFields = req.query.fields.split(',');
      formattedOrders = orders.map((order) => {
        const filteredOrder = {};
        selectFields.forEach((field) => {
          if (order[field] !== undefined) filteredOrder[field] = order[field];
        });
        return filteredOrder;
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Orders fetched successfully',
      data: {
        results: orders.length,
        orders: formattedOrders,
        totalPages,
        currentPage: page,
        error: null,
      },
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    [order] = await pool.execute(
      'SELECT orders.*, users.name, users.phone, users.email FROM orders INNER JOIN users ON orders.userId = users.id WHERE orders.id = ?',
      [req.params.id]
    );
    if (order.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Order not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        order: order[0],
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { status } = req.body;
    const [order] = await pool.execute('SELECT * FROM orders WHERE id = ?', [
      req.params.id,
    ]);

    if (order.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Order not found',
      });
    }

    const possibleStatuses = [
      'processing',
      'pending',
      'shipped',
      'delivered',
      'cancelled',
    ];

    if (!possibleStatuses.includes(status)) {
      return res.status(400).json({
        status: 'fail',
        message:
          'Invalid status value provided.It needs to be one of the following: processing, pending, shipped, delivered, cancelled',
      });
    }

    await pool.execute(
      'UPDATE orders SET status = ?, updatedAt = NOW() WHERE id = ?',
      [status, req.params.id]
    );

    res.status(200).json({
      status: 'success',
      message: 'Order updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const [order] = await pool.execute('SELECT * FROM orders WHERE id = ?', [
      req.params.id,
    ]);

    if (order.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'Order not found',
      });
    }

    await pool.execute('DELETE FROM orders WHERE id = ?', [req.params.id]);

    res.status(204).json({
      status: 'success',
      message: 'Order deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};
