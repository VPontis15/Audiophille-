const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/config');

async function seedUsers(count = 50) {
  try {
    console.log(`Seeding ${count} users...`);

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = {
      name: 'Admin User',
      email: 'admin@audiophile.com',
      password: adminPassword,
      isAdmin: true,
      address: '123 Admin Street',
      city: 'Tech City',
      country: 'USA',
      postalCode: '90210',
      phone: '(555) 123-4567',
    };

    const adminSql = `INSERT INTO users SET ?`;
    await pool.query(adminSql, adminUser);
    console.log('Admin user created');

    // Create regular users
    for (let i = 0; i < count; i++) {
      const hashedPassword = await bcrypt.hash('password123', 10);

      const user = {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: hashedPassword,
        isAdmin: false,
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        country: faker.location.country(),
        postalCode: faker.location.zipCode(),
        phone: faker.phone.number(),
        profileImage: faker.image.avatar(),
        createdAt: faker.date.past({ years: 2 }),
        updatedAt: faker.date.recent(),
      };

      const sql = `INSERT INTO users SET ?`;
      await pool.query(sql, user);
    }

    console.log(`${count} users seeded successfully`);
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await pool.end();
  }
}

// Run the seeder with default or specified count
seedUsers(process.argv[2] || 50)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
