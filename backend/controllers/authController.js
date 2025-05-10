const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    // Check if user already exists
    console.log('Received signup request:', req.body);
    const existingUser = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already exists',
      });
    }
    // Create new user
    const newUser = await prisma.users.create({
      data: {
        name: name,
        email: email,
        password: password, // In a real application, hash the password before saving
      },
    });
    // Send response
    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          createdAt: newUser.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};
