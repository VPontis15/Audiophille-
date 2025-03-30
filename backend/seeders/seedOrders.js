const { faker } = require('@faker-js/faker');
const { pool } = require('../config/config');

async function seedOrders(count = 100) {
  try {
    console.log(`Seeding ${count} orders...`);

    // First, get all users from the database
    const [users] = await pool.query('SELECT id FROM users LIMIT 100');

    // Then, get all products from the database
    const [products] = await pool.query(
      'SELECT id, price FROM products LIMIT 500'
    );

    if (users.length === 0 || products.length === 0) {
      throw new Error('You need to seed users and products first');
    }

    // Order status options
    const orderStatuses = [
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ];

    // Payment methods - replace credit_card with viva
    const paymentMethods = [
      'viva',
      'paypal',
      'stripe',
      'credit_card',
      'bank_transfer',
      'cash_on_delivery',
    ];

    // Create random orders
    for (let i = 0; i < count; i++) {
      const userId =
        users[faker.number.int({ min: 0, max: users.length - 1 })].id;

      // Generate a random number of products for this order (1-5)
      const numProducts = faker.number.int({ min: 1, max: 5 });
      let orderItems = [];
      let totalPrice = 0;

      // Generate order items
      for (let j = 0; j < numProducts; j++) {
        const product =
          products[faker.number.int({ min: 0, max: products.length - 1 })];
        const quantity = faker.number.int({ min: 1, max: 3 });
        const itemPrice = product.price;
        const itemTotal = itemPrice * quantity;

        orderItems.push({
          productId: product.id,
          quantity,
          price: itemPrice,
        });

        totalPrice += itemTotal;
      }

      // Create shipping address
      const shippingAddress = {
        name: faker.person.fullName(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        postalCode: faker.location.zipCode(),
        country: faker.location.country(),
        phone: faker.phone.number(),
      };

      // Calculate additional costs
      const shippingPrice = faker.number.float({
        min: 5,
        max: 25,
        precision: 0.01,
      });
      const taxPrice = totalPrice * 0.1; // 10% tax
      const finalTotal = totalPrice + shippingPrice + taxPrice;

      // Create order
      const order = {
        userId,
        orderItems: JSON.stringify(orderItems),
        shippingAddress: JSON.stringify(shippingAddress),
        paymentMethod: faker.helpers.arrayElement(paymentMethods),
        itemsPrice: totalPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        totalPrice: finalTotal.toFixed(2),
        isPaid: faker.datatype.boolean(0.7), // 70% of orders are paid
        paidAt: null,
        status: faker.helpers.arrayElement(orderStatuses),
        deliveredAt: null,
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent(),
      };

      // Set paid date if order is paid
      if (order.isPaid) {
        order.paidAt = new Date(
          faker.date.between({
            from: order.createdAt,
            to: new Date(order.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days after order creation
          })
        );
      }

      // Set delivered date if order is delivered
      if (order.status === 'delivered') {
        const deliveryDate = order.isPaid ? order.paidAt : order.createdAt;

        order.deliveredAt = new Date(
          faker.date.between({
            from: deliveryDate,
            to: new Date(deliveryDate.getTime() + 7 * 24 * 60 * 60 * 1000), // Up to 7 days after payment/creation
          })
        );
      }

      // Insert order into database
      const [orderResult] = await pool.query('INSERT INTO orders SET ?', order);
      const orderId = orderResult.insertId;

      // Insert individual order items
      for (const item of orderItems) {
        await pool.query(
          'INSERT INTO orderItems (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.productId, item.quantity, item.price]
        );
      }

      if ((i + 1) % 10 === 0) {
        console.log(`Created ${i + 1} orders so far...`);
      }
    }

    console.log(`${count} orders seeded successfully`);
  } catch (error) {
    console.error('Error seeding orders:', error);
  } finally {
    await pool.end();
  }
}

// Run the seeder with default or specified count
seedOrders(process.argv[2] || 100)
  .then(() => console.log('Order seeding completed'))
  .catch((err) => {
    console.error('Order seeding failed:', err);
    process.exit(1);
  });
