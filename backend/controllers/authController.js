const { PrismaClient } = require('@prisma/client');
const {
  hashPassword,
  comparePassword,
} = require('../middleware/passwordMiddleware');
const prisma = new PrismaClient();

exports.signup = async (req, res) => {
  try {
    const { email, password, name, confirmedPassword } = req.body;

    // Check if user already exists
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

    // Check if passwords match
    if (password !== confirmedPassword) {
      return res.status(400).json({
        status: 'fail',
        message: 'Passwords do not match',
      });
    }

    // Hash the password before storing
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = await prisma.users.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
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

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password',
      });
    }

    // Check if password is correct
    const isPasswordCorrect = await comparePassword(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password',
      });
    }

    // Send response
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};
