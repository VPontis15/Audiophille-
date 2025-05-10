const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllBrands = async function (req, res) {
  try {
    // Initialize parameters for Prisma query
    const where = {};

    // 1) FILTERING
    const filterableFields = [
      'name',
      'country',
      'isPopular',
      'slug',
      'createdAt',
    ];

    // Process query parameters for filtering
    Object.keys(req.query).forEach((key) => {
      // Skip pagination, sorting and fields parameters
      if (['page', 'limit', 'sort', 'fields'].includes(key)) return;

      // Handle basic equality filters
      if (filterableFields.includes(key)) {
        // Handle isPopular as boolean
        if (key === 'isPopular') {
          where[key] = req.query[key].toLowerCase() === 'true';
        }
        // Handle text search with contains
        else if (typeof req.query[key] === 'object' && req.query[key].like) {
          where[key] = { contains: req.query[key].like };
        }
        // Handle exact equality
        else {
          where[key] = req.query[key];
        }
      }
    });

    // 2) SORTING
    const orderBy = [];
    if (req.query.sort) {
      const sortFields = req.query.sort.split(',');
      sortFields.forEach((field) => {
        // Normalize field name by converting to camelCase if needed
        let normalizedField = field;
        if (field.startsWith('-')) {
          normalizedField = field.substring(1);
        }

        // Map field names to correct casing for Prisma
        const fieldMap = {
          createdat: 'createdAt',
          updatedat: 'updatedAt',
          ispopular: 'isPopular',
          // Add other fields that might need case correction
        };

        const prismaField =
          fieldMap[normalizedField.toLowerCase()] || normalizedField;

        if (field.startsWith('-')) {
          orderBy.push({ [prismaField]: 'desc' });
        } else {
          orderBy.push({ [prismaField]: 'asc' });
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

    // Get total count for pagination metadata
    const totalBrands = await prisma.brands.count({ where });
    const totalPages = Math.ceil(totalBrands / limit);

    // Execute the main query
    const brands = await prisma.brands.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    // 4) FIELD SELECTION
    let result = brands;
    if (req.query.fields) {
      const fields = req.query.fields.split(',');
      const validFields = [
        'id',
        'name',
        'slug',
        'description',
        'country',
        'isPopular',
        'logo',
        'website',
        'createdAt',
        'updatedAt',
      ];

      // Filter brands to only include requested fields
      result = brands.map((brand) => {
        const filteredBrand = {};
        fields.forEach((field) => {
          if (validFields.includes(field)) {
            filteredBrand[field] = brand[field];
          }
        });
        return filteredBrand;
      });
    }

    // Return response
    res.status(200).json({
      status: 'success',
      results: result.length,
      totalBrands,
      totalPages,
      currentPage: page,
      data: {
        brands: result,
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
    const brand = await prisma.brands.findFirstOrThrow({
      where: {
        slug: req.params.slug,
      },
    });
    res.status(200).json({
      status: 'success',
      data: {
        brand,
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
    // Generate slug safely
    let slug = req.body.slug;
    if (!slug && req.body.name) {
      slug = req.body.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    } else if (!slug) {
      // Fallback if neither slug nor name is provided
      slug = `brand-${Date.now()}`;
    }

    // Added await here
    const newBrand = await prisma.brands.create({
      data: {
        ...req.body,
        isPopular: req.body.isPopular ? true : false, // Convert to boolean
        logo: req.file ? req.file.path : null, // Handle file upload
        slug: slug,
      },
    });

    // Return created brand with all provided fields
    res.status(201).json({
      status: 'success',
      data: {
        brand: newBrand,
      },
    });
  } catch (error) {
    console.error('Error creating brand:', error);
    // Handle duplicate entry error - using Prisma error code
    if (error.code === 'P2002') {
      return res.status(400).json({
        status: 'fail',
        message: 'A brand with this name or slug already exists',
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
    const brandToUpdate = await prisma.brands.findFirstOrThrow({
      where: {
        slug: req.params.slug,
      },
    });

    const updatedBrand = await prisma.brands.update({
      where: {
        id: brandToUpdate.id,
      },
      data: {
        ...req.body,
        isPopular: req.body.isPopular ? true : false, // Convert to boolean
        logo: req.file ? req.file.path : null, // Handle file upload
        slug:
          req.body.slug ||
          req.body.name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, ''),
      },
    });
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
        message: 'A brand with this name or slug already exists',
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
    const brandToDelete = await prisma.brands.findFirst({
      where: {
        slug: req.params.slug,
      },
    });
    if (!brandToDelete) {
      return res.status(404).json({
        status: 'fail',
        message: 'Brand not found',
      });
    }
    // Now we can delete directly by slug since it's unique
    await prisma.brands.delete({
      where: {
        id: brandToDelete.id,
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Brand deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting brand:', error);

    // Handle record not found
    if (error.code === 'P2025') {
      return res.status(404).json({
        status: 'fail',
        message: 'Brand not found',
      });
    }

    // Handle foreign key constraint error
    if (error.code === 'P2003') {
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
