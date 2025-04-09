const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllProducts = async (req, res) => {
  try {
    // Initialize parameters for Prisma query
    const where = {};

    // Process query parameters for filtering
    Object.keys(req.query).forEach((key) => {
      // Skip pagination, sorting and fields parameters
      if (['page', 'limit', 'sort', 'fields'].includes(key)) return;

      // Handle various filter types
      if (key === 'category') {
        where.categories = {
          name: req.query[key],
        };
      } else if (key === 'brand') {
        where.brands = {
          name: req.query[key],
        };
      } else if (key === 'brandCountry') {
        where.brands = {
          country: req.query[key],
        };
      }
      // Handle special filtering operators
      else if (typeof req.query[key] === 'object') {
        const operators = req.query[key];

        for (const op in operators) {
          switch (op) {
            case 'gt':
              where[key] = { gt: parseFloat(operators[op]) };
              break;
            case 'gte':
              where[key] = { gte: parseFloat(operators[op]) };
              break;
            case 'lt':
              where[key] = { lt: parseFloat(operators[op]) };
              break;
            case 'lte':
              where[key] = { lte: parseFloat(operators[op]) };
              break;
            case 'like':
              where[key] = { contains: operators[op] };
              break;
          }
        }
      }
      // Handle boolean fields
      else if (req.query[key] === 'true' || req.query[key] === 'false') {
        where[key] = req.query[key] === 'true';
      }
      // Handle regular equality
      else {
        where[key] = req.query[key];
      }
    });

    // 2) SORTING
    const orderBy = [];
    if (req.query.sort) {
      const sortFields = req.query.sort.split(',');
      sortFields.forEach((field) => {
        // Map field names to correct casing for Prisma
        const fieldMap = {
          createdat: 'createdAt',
          updatedat: 'updatedAt',
          category: { categories: { name: 'asc' } },
          brand: { brands: { name: 'asc' } },
        };

        const isDesc = field.startsWith('-');
        const cleanField = isDesc ? field.substring(1) : field;

        // Handle special relation sorting
        if (cleanField === 'category') {
          orderBy.push({
            categories: { name: isDesc ? 'desc' : 'asc' },
          });
        } else if (cleanField === 'brand') {
          orderBy.push({
            brands: { name: isDesc ? 'desc' : 'asc' },
          });
        } else {
          // Regular field sorting
          const prismaField = fieldMap[cleanField.toLowerCase()] || cleanField;
          orderBy.push({ [prismaField]: isDesc ? 'desc' : 'asc' });
        }
      });
    } else {
      // Default sort
      orderBy.push({ createdAt: 'desc' });
    }

    // 3) PAGINATION
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // 4) EXECUTE QUERIES
    const totalProducts = await prisma.products.count({ where });
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await prisma.products.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        categories: {
          select: {
            name: true,
            slug: true,
          },
        },
        brands: {
          select: {
            name: true,
            country: true,
          },
        },
      },
    });

    // Format the response to match the expected structure
    const formattedProducts = products.map((product) => ({
      ...product,
      category: product.categories.name,
      categorySlug: product.categories.slug,
      brand: product.brands.name,
      brandCountry: product.brands.country,
      // Remove the nested objects
      categories: undefined,
      brands: undefined,
    }));

    // 5) FIELD SELECTION
    let result = formattedProducts;
    if (req.query.fields) {
      const selectFields = req.query.fields.split(',');
      result = formattedProducts.map((product) => {
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
      results: result.length,
      totalProducts,
      totalPages,
      currentPage: page,
      products: result,
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

    // Generate slug if not provided
    const slug =
      req.body.slug ||
      req.body.name
        .trim()
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^a-z0-9-]/g, '');

    // Create the product with Prisma
    const newProduct = await prisma.products.create({
      data: {
        ...req.body,
        slug,
      },
      include: {
        categories: true,
        brands: true,
      },
    });

    // Format the response
    const formattedProduct = {
      ...newProduct,
      category: newProduct.categories.name,
      categorySlug: newProduct.categories.slug,
      brand: newProduct.brands.name,
      brandCountry: newProduct.brands.country,
      // Remove the nested objects
      categories: undefined,
      brands: undefined,
    };

    // Respond with created product
    res.status(201).json({
      status: 'Success',
      product: formattedProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error);

    // Handle specific error cases
    if (error.code === 'P2002') {
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
    const product = await prisma.products.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      include: {
        categories: true,
        brands: true,
      },
    });

    // Check if product exists
    if (!product) {
      return res.status(404).json({
        status: 'Fail',
        message: `No product found with ID ${req.params.id}`,
      });
    }

    // Format the response
    const formattedProduct = {
      ...product,
      category: product.categories.name,
      categorySlug: product.categories.slug,
      brand: product.brands.name,
      brandCountry: product.brands.country,
      // Remove the nested objects
      categories: undefined,
      brands: undefined,
    };

    // If product exists, return it
    res.status(200).json({
      status: 'Success',
      product: formattedProduct,
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
    // Find the product to update first
    const existingProduct = await prisma.products.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      include: {
        categories: true,
        brands: true,
      },
    });

    // Check if product exists
    if (!existingProduct) {
      return res.status(404).json({
        status: 'Fail',
        message: 'Product not found',
      });
    }

    // Remove fields that shouldn't be updated
    const updateData = { ...req.body };
    delete updateData.id; // Prevent ID manipulation
    delete updateData.createdAt; // Prevent modifying creation timestamp

    // Update the product
    const updatedProduct = await prisma.products.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: updateData,
      include: {
        categories: true,
        brands: true,
      },
    });

    // Format the response
    const formattedProduct = {
      ...updatedProduct,
      category: updatedProduct.categories.name,
      categorySlug: updatedProduct.categories.slug,
      brand: updatedProduct.brands.name,
      brandCountry: updatedProduct.brands.country,
      // Remove the nested objects
      categories: undefined,
      brands: undefined,
    };

    res.status(200).json({
      status: 'Success',
      product: formattedProduct,
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
    // Find product by slug first
    const product = await prisma.products.findFirst({
      where: {
        slug: req.params.slug,
      },
    });

    if (!product) {
      return res.status(404).json({
        status: 'Fail',
        message: 'Product not found',
      });
    }

    // Then delete by ID
    await prisma.products.delete({
      where: {
        id: product.id,
      },
    });

    // 204 No Content is appropriate for successful delete with no response body
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting product:', error);

    // Handle constraints
    if (error.code === 'P2003') {
      return res.status(400).json({
        status: 'Error',
        message:
          'Cannot delete this product because it is referenced by other records',
      });
    }

    res.status(500).json({
      status: 'Error',
      message: 'Unable to delete product',
      error: error.message,
    });
  }
};
