const { faker } = require('@faker-js/faker');
const { pool } = require('../config/config');

async function seedOrders(count = 100) {
  try {
    console.log(`Seeding ${count} orders...`);

    // Get users that actually exist in the database
    const [users] = await pool.query('SELECT id FROM users ORDER BY id');
    if (users.length === 0) {
      throw new Error(
        'No users found in the database. Please run the user seeder first.'
      );
    }
    console.log(`Found ${users.length} users to create orders for`);

    // Get products that actually exist in the database
    const [products] = await pool.query(
      'SELECT id, name, price, featuredImage FROM products'
    );
    if (products.length === 0) {
      throw new Error(
        'No products found in the database. Please run the product seeder first.'
      );
    }
    console.log(`Found ${products.length} products to add to orders`);

    // Check the structure of orders table to see what columns it has
    const [orderColumns] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'orders'
    `);

    const orderColumnNames = orderColumns.map((col) =>
      col.COLUMN_NAME.toLowerCase()
    );
    console.log('Detected order columns:', orderColumnNames.join(', '));

    // Check if orderItems table exists
    const [orderItemsTable] = await pool.query(`
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = DATABASE() AND table_name = 'orderItems'
    `);
    const orderItemsTableExists = orderItemsTable.length > 0;
    console.log(
      `OrderItems table ${orderItemsTableExists ? 'exists' : 'does not exist'}`
    );

    // Generate and insert orders
    for (let i = 0; i < count; i++) {
      // Select a random user
      const randomUserIndex = faker.number.int({
        min: 0,
        max: users.length - 1,
      });
      const userId = users[randomUserIndex].id;

      // Generate between 1 and 5 order items
      const numItems = faker.number.int({ min: 1, max: 5 });
      const orderItems = [];
      let itemsPrice = 0;

      // Generate random order items
      for (let j = 0; j < numItems; j++) {
        const randomProductIndex = faker.number.int({
          min: 0,
          max: products.length - 1,
        });
        const product = products[randomProductIndex];
        const quantity = faker.number.int({ min: 1, max: 5 });
        const price = parseFloat(product.price);

        orderItems.push({
          productId: product.id,
          name: product.name,
          quantity,
          price,
        });

        itemsPrice += price * quantity;
      }

      // Round itemsPrice to 2 decimal places
      itemsPrice = parseFloat(itemsPrice.toFixed(2));

      // Generate shipping address
      const shippingAddress = {
        name: faker.person.fullName(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        postalCode: faker.location.zipCode(),
        country: faker.location.country(),
        phone: faker.phone.number(),
      };

      // Calculate order totals
      const shippingPrice = parseFloat((itemsPrice * 0.005).toFixed(2)); // 0.5% of items total
      const taxPrice = parseFloat((itemsPrice * 0.1).toFixed(2)); // 10% tax
      const totalPrice = parseFloat(
        (itemsPrice + shippingPrice + taxPrice).toFixed(2)
      );

      // Choose payment method
      const paymentMethod = faker.helpers.arrayElement([
        'paypal',
        'stripe',
        'credit_card',
        'cash_on_delivery',
      ]);

      // Order status and dates
      const statusOptions = [
        'pending',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
      ];
      const status = faker.helpers.arrayElement(statusOptions);

      const createdAt = faker.date.past({ days: 60 });
      const isPaid = status !== 'pending' && faker.datatype.boolean(0.8);

      let paidAt = null;
      if (isPaid) {
        paidAt = new Date(
          createdAt.getTime() +
            faker.number.int({ min: 1, max: 48 }) * 60 * 60 * 1000
        ); // 1-48 hours after order
      }

      let deliveredAt = null;
      if (status === 'delivered') {
        deliveredAt = new Date(
          createdAt.getTime() +
            faker.number.int({ min: 48, max: 240 }) * 60 * 60 * 1000
        ); // 2-10 days after order
      }

      const updatedAt = new Date();

      // Create order object without orderItems field
      const orderData = {
        userId,
        shippingAddress: JSON.stringify(shippingAddress),
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        isPaid,
        paidAt,
        status,
        deliveredAt,
        createdAt,
        updatedAt,
      };

      // Remove any properties that don't exist in the orders table
      for (const key in orderData) {
        if (!orderColumnNames.includes(key.toLowerCase())) {
          delete orderData[key];
          console.log(`Removed non-existent column '${key}' from order data`);
        }
      }

      try {
        // Insert order
        const [orderResult] = await pool.query(
          'INSERT INTO orders SET ?',
          orderData
        );
        const orderId = orderResult.insertId;
        console.log(`Created order #${orderId} for user #${userId}`);

        // If orderItems table exists, insert items there
        if (orderItemsTableExists) {
          console.log(`Adding ${orderItems.length} items to order #${orderId}`);
          for (const item of orderItems) {
            // Get product image
            const product = products.find((p) => p.id === item.productId);
            let image = '';

            if (product && product.featuredImage) {
              try {
                const featuredImage = JSON.parse(product.featuredImage);
                if (featuredImage.thumbnail && featuredImage.thumbnail.url) {
                  image = featuredImage.thumbnail.url;
                } else if (featuredImage.mobile && featuredImage.mobile.url) {
                  image = featuredImage.mobile.url;
                }
              } catch (e) {
                console.warn(
                  `Could not parse featuredImage for product ${product.id}`
                );
              }
            }

            await pool.query('INSERT INTO orderItems SET ?', {
              orderId,
              productId: item.productId,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              image,
            });
          }
        }

        if ((i + 1) % 10 === 0 || i === count - 1) {
          console.log(`Added ${i + 1}/${count} orders`);
        }
      } catch (error) {
        console.error(`Error creating order ${i + 1}:`, error.message);
        // Continue with next order
      }
    }

    console.log('Order seeding completed successfully');
  } catch (error) {
    console.error('Error seeding orders:', error);
    throw error;
  } finally {
    console.log('Closing database connection');
    await pool.end();
  }
}

// Run the seeder with default or specified count
seedOrders(process.argv[2] || 100)
  .then(() => console.log('Order seeding process finished'))
  .catch((err) => {
    console.error('Order seeding failed:', err);
    process.exit(1);
  });
