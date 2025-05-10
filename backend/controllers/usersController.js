const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany();

    res.status(200).json({
      status: 'success',
      results: users.length,
      users,
    });
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Unable to retrieve users',
      error: error.message,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = await prisma.users.create({
      data: req.body,
    });

    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      user: newUser,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Unable to create user',
      error: error.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      user,
    });
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Unable to retrieve user',
      error: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await prisma.users.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: req.body,
    });

    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Unable to update user',
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await prisma.users.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    res.status(204).json({
      status: 'success',
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      status: 'Error',
      message: 'Unable to delete user',
      error: error.message,
    });
  }
};
