const { faker } = require('@faker-js/faker');
const { pool } = require('../config/config');

async function seedCarts(count = 30) {
  try {
    console.log(`Seeding ${count} carts...`);

    // Get users that actually exist in the database
    const [users] = await pool.query('SELECT id FROM users ORDER BY id');

    if (users.length === 0) {
      throw new Error(
        'No users found in the database. Please run the user seeder first.'
      );
    }

    console.log(`Found ${users.length} users to create carts for`);

    // Get products that actually exist in the database
    const [products] = await pool.query('SELECT id, price FROM products');

    if (products.length === 0) {
      throw new Error(
        'No products found in the database. Please run the product seeder first.'
      );
    }

    console.log(`Found ${products.length} products to add to carts`);

    // Create carts for a subset of users
    const userCount = Math.min(count, users.length);
    console.log(`Will create carts for ${userCount} users`);

    for (let i = 0; i < userCount; i++) {
      const user = users[i];
      const userId = user.id;

      console.log(`Processing user ID ${userId} (${i + 1}/${userCount})`);

      // Check if this user already has a cart
      const [existingCarts] = await pool.query(
        'SELECT id FROM carts WHERE userId = ?',
        [userId]
      );

      let cartId;
      if (existingCarts.length > 0) {
        cartId = existingCarts[0].id;
        console.log(`User ID ${userId} already has cart #${cartId}`);
      } else {
        try {
          // Create a cart for this user - we'll use a direct SQL query to see more info
          console.log(`Inserting cart for user ID ${userId}`);
          const [cartResult] = await pool.query(
            'INSERT INTO carts (userId) VALUES (?)',
            [userId]
          );
          cartId = cartResult.insertId;
          console.log(`Created new cart #${cartId} for user ID ${userId}`);
        } catch (error) {
          console.error(`Failed to create cart for user ID ${userId}:`, error);
          continue; // Skip to next user
        }
      }

      // Delete any existing cart items
      try {
        await pool.query('DELETE FROM cartItems WHERE cartId = ?', [cartId]);
        console.log(`Cleared existing items from cart #${cartId}`);
      } catch (error) {
        console.error(`Failed to clear items from cart #${cartId}:`, error);
      }

      // Add 1-5 random products to this cart
      const numProducts = faker.number.int({ min: 1, max: 5 });
      let successCount = 0;

      for (let j = 0; j < numProducts; j++) {
        const randomIndex = faker.number.int({
          min: 0,
          max: products.length - 1,
        });
        const product = products[randomIndex];
        const quantity = faker.number.int({ min: 1, max: 3 });

        try {
          await pool.query(
            'INSERT INTO cartItems (cartId, productId, quantity, price) VALUES (?, ?, ?, ?)',
            [cartId, product.id, quantity, product.price]
          );
          successCount++;
        } catch (error) {
          console.error(
            `Error adding product ${product.id} to cart ${cartId}:`,
            error.message
          );
        }
      }

      console.log(`Added ${successCount} items to cart #${cartId}`);
    }

    console.log(`Completed cart seeding process`);
  } catch (error) {
    console.error('Error seeding carts:', error);
  } finally {
    console.log('Closing database connection');
    await pool.end();
  }
}

// Run the seeder with default or specified count
seedCarts(process.argv[2] || 30)
  .then(() => console.log('Cart seeding completed successfully'))
  .catch((err) => {
    console.error('Cart seeding failed:', err);
    process.exit(1);
  });
