const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllCategories = async (req, res) => {
  try {
    // Check if hierarchy is requested
    const includeHierarchy = req.query.hierarchy === 'true';

    // Handle hierarchical view
    if (includeHierarchy) {
      const parentCategories = await prisma.categories.findMany({
        where: {
          parentId: null,
        },
        include: {
          subcategories: true, // This assumes a relation named "subcategories" in your Prisma schema
        },
      });

      // Apply field selection if requested
      let formattedCategories = parentCategories;
      if (req.query.fields) {
        const selectFields = req.query.fields.split(',');
        formattedCategories = parentCategories.map((category) => {
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
    const where = {};

    // Process query parameters for filtering
    const query = { ...req.query };
    const excludedFields = ['page', 'limit', 'sort', 'fields', 'hierarchy'];

    Object.keys(query).forEach((key) => {
      // Skip excluded fields
      if (excludedFields.includes(key)) return;

      // Handle various filter operators
      if (typeof query[key] === 'object') {
        for (const op in query[key]) {
          switch (op) {
            case 'gt':
              where[key] = { gt: parseFloat(query[key][op]) };
              break;
            case 'gte':
              where[key] = { gte: parseFloat(query[key][op]) };
              break;
            case 'lt':
              where[key] = { lt: parseFloat(query[key][op]) };
              break;
            case 'lte':
              where[key] = { lte: parseFloat(query[key][op]) };
              break;
            case 'like':
              where[key] = { contains: query[key][op] };
              break;
          }
        }
      } else {
        // Simple equality
        where[key] = query[key];
      }
    });

    // Sorting
    const orderBy = [];
    if (req.query.sort) {
      const sortFields = req.query.sort.split(',');
      sortFields.forEach((field) => {
        const isDesc = field.startsWith('-');
        const cleanField = isDesc ? field.substring(1) : field;

        // Handle casing for Prisma
        const fieldMap = {
          createdat: 'createdAt',
          updatedat: 'updatedAt',
        };

        const prismaField = fieldMap[cleanField.toLowerCase()] || cleanField;
        orderBy.push({ [prismaField]: isDesc ? 'desc' : 'asc' });
      });
    } else {
      orderBy.push({ id: 'asc' });
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Count total categories
    const totalCategories = await prisma.categories.count({ where });
    const totalPages = Math.ceil(totalCategories / limit);

    // Get categories with pagination
    const categories = await prisma.categories.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

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
    console.error('Error fetching categories:', error);
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const category = await prisma.categories.findFirst({
      where: {
        slug: req.params.slug,
      },
    });

    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: 'Category not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        category,
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
    // Validate request body
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: 'Fail',
        message: 'No category data provided',
      });
    }

    // Generate slug if not provided
    const slug =
      req.body.slug ||
      req.body.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    // Create category with Prisma
    const newCategory = await prisma.categories.create({
      data: {
        ...req.body,
        slug,
      },
    });

    // Respond with created category
    res.status(201).json({
      status: 'Success',
      category: newCategory,
    });
  } catch (error) {
    console.error('Error creating category:', error);

    // Handle specific error cases
    if (error.code === 'P2002') {
      return res.status(409).json({
        status: 'Fail',
        message: 'A category with this unique identifier already exists',
      });
    }

    // Generic server error
    res.status(500).json({
      status: 'Error',
      message: 'Unable to create category',
      error: error.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    // Validate request body
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: 'Fail',
        message: 'No category data provided',
      });
    }

    // Make sure name exists if attempting to update
    if (req.body.name === '') {
      return res.status(400).json({
        status: 'fail',
        message: 'Category name cannot be empty',
      });
    }

    // Find the category by slug first
    const category = await prisma.categories.findFirst({
      where: {
        slug: req.params.slug,
      },
    });

    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: 'Category not found',
      });
    }

    // Generate slug if name is updated but slug isn't provided
    let updateData = { ...req.body };
    if (updateData.name && !updateData.slug) {
      updateData.slug = updateData.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }

    // Update the category
    const updatedCategory = await prisma.categories.update({
      where: {
        id: category.id,
      },
      data: updateData,
    });

    res.status(200).json({
      status: 'success',
      data: {
        category: updatedCategory,
      },
    });
  } catch (error) {
    console.error('Error updating category:', error);

    // Handle specific error cases
    if (error.code === 'P2002') {
      return res.status(409).json({
        status: 'Fail',
        message: 'A category with this unique identifier already exists',
      });
    }

    // Generic server error
    res.status(500).json({
      status: 'Error',
      message: 'Unable to update category',
      error: error.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    // Find category by slug first
    const category = await prisma.categories.findFirst({
      where: {
        slug: req.params.slug,
      },
    });

    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: 'Category not found',
      });
    }

    // Delete the category by ID
    await prisma.categories.delete({
      where: {
        id: category.id,
      },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    console.error('Error deleting category:', error);

    // Handle constraint errors
    if (error.code === 'P2003') {
      return res.status(400).json({
        status: 'fail',
        message:
          'Cannot delete this category because it is referenced by other records',
      });
    }

    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.getCategoryProducts = async (req, res) => {
  try {
    const products = await prisma.products.findMany({
      where: {
        categoryId: parseInt(req.params.id),
      },
    });

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
    // Get all parent categories
    const parentCategories = await prisma.categories.findMany({
      where: {
        parentId: null,
      },
      include: {
        subcategories: true, // This assumes a relation named "subcategories" in your Prisma schema
      },
    });

    // Format response to expected structure
    const categoryHierarchy = parentCategories.map((parent) => ({
      id: parent.id,
      name: parent.name,
      slug: parent.slug,
      subcategories: parent.subcategories.map((child) => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
      })),
    }));

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
