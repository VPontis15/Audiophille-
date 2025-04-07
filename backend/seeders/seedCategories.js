const { faker } = require('@faker-js/faker');
const { pool } = require('../config/config');
const fs = require('fs');
const path = require('path');

// Define the main categories for audio equipment
const mainCategories = [
  {
    name: 'headphones',
    slug: 'headphones',
    description:
      'Premium over-ear and on-ear headphones for the ultimate listening experience.',
  },
  {
    name: 'earphones',
    slug: 'earphones',
    description:
      'Compact and portable in-ear audio solutions for music on the go.',
  },
  {
    name: 'speakers',
    slug: 'speakers',
    description:
      'Powerful audio systems designed to fill your space with rich, immersive sound.',
  },
];

// Define subcategories for each main category
const subcategories = {
  headphones: [
    'Over-Ear Headphones',
    'On-Ear Headphones',
    'Gaming Headsets',
    'DJ Headphones',
    'Studio Headphones',
    'Wireless Headphones',
    'Noise-Cancelling Headphones',
  ],
  earphones: [
    'In-Ear Monitors',
    'True Wireless Earbuds',
    'Sport Earphones',
    'Wired Earphones',
    'Noise-Isolating Earphones',
  ],
  speakers: [
    'Bluetooth Speakers',
    'Smart Speakers',
    'Bookshelf Speakers',
    'Floor Standing Speakers',
    'Portable Speakers',
    'Soundbars',
    'Studio Monitors',
    'Home Theater Systems',
  ],
};

// Helper function to create slugs
function createSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

// Helper function to generate descriptions for categories
function generateCategoryDescription(name) {
  if (name === 'headphones') {
    return 'Premium over-ear and on-ear headphones for the ultimate listening experience.';
  } else if (name === 'earphones') {
    return 'Compact and portable in-ear audio solutions for music on the go.';
  } else if (name === 'speakers') {
    return 'Powerful audio systems designed to fill your space with rich, immersive sound.';
  }

  // Generate descriptions for subcategories
  if (name.includes('Over-Ear')) {
    return 'Circumaural headphones that completely cover your ears for maximum sound isolation and comfort.';
  } else if (name.includes('On-Ear')) {
    return 'Supra-aural headphones that rest on your ears, offering a balance of portability and sound quality.';
  } else if (name.includes('Gaming')) {
    return 'Specialized headsets designed for immersive gaming experiences with directional audio and microphones.';
  } else if (name.includes('DJ')) {
    return 'Robust headphones with swiveling ear cups and powerful bass response for professional DJs.';
  } else if (name.includes('Studio')) {
    return 'Precision-engineered headphones for audio production, monitoring, and critical listening.';
  } else if (name.includes('Wireless')) {
    return 'Freedom from cables with Bluetooth connectivity while maintaining excellent sound quality.';
  } else if (name.includes('Noise-Cancelling')) {
    return 'Active technology that reduces ambient noise for an immersive listening experience.';
  } else if (name.includes('In-Ear')) {
    return 'Professional in-ear monitors with exceptional sound isolation and balanced audio reproduction.';
  } else if (name.includes('True Wireless')) {
    return 'Completely wireless earbuds with no cables between each earpiece for ultimate freedom.';
  } else if (name.includes('Sport')) {
    return 'Sweat-resistant earphones with secure fit designs for active lifestyles and workouts.';
  } else if (name.includes('Wired')) {
    return 'Traditional earphones with reliable cable connections for consistent audio quality.';
  } else if (name.includes('Noise-Isolating')) {
    return 'Earphones designed to physically block external sounds for focused listening.';
  } else if (name.includes('Bluetooth')) {
    return 'Wireless speakers that connect easily to your devices for convenient audio streaming.';
  } else if (name.includes('Smart')) {
    return 'Internet-connected speakers with voice assistants and smart home integration.';
  } else if (name.includes('Bookshelf')) {
    return 'Compact yet powerful speakers designed to deliver high-quality sound in smaller spaces.';
  } else if (name.includes('Floor Standing')) {
    return 'Large, powerful speakers that deliver full-range sound with impressive bass response.';
  } else if (name.includes('Portable')) {
    return 'Compact, battery-powered speakers for on-the-go audio experiences.';
  } else if (name.includes('Soundbars')) {
    return 'Slim, elongated speakers designed to enhance TV audio with minimal space requirements.';
  } else if (name.includes('Studio Monitors')) {
    return 'Precision speakers with flat frequency response for professional audio production.';
  } else if (name.includes('Home Theater')) {
    return 'Complete speaker systems designed to create immersive surround sound experiences.';
  }

  // Default description
  return `High-quality ${name} for audiophiles and music enthusiasts.`;
}

async function seedCategories() {
  try {
    console.log('Seeding categories...');

    // Insert main categories first
    for (const category of mainCategories) {
      const sql = `
        INSERT INTO categories (name, slug, description, is_featured) 
        VALUES (?, ?, ?, true)
      `;

      await pool.query(sql, [
        category.name,
        category.slug,
        category.description,
      ]);

      console.log(`Added main category: ${category.name}`);
    }

    // Get the IDs of the main categories
    const [mainCategoriesResult] = await pool.query(
      'SELECT id, name FROM categories'
    );
    const mainCategoryMap = {};

    mainCategoriesResult.forEach((category) => {
      mainCategoryMap[category.name] = category.id;
    });

    // Insert subcategories with parent_id references and slugs
    for (const mainCategory in subcategories) {
      if (subcategories.hasOwnProperty(mainCategory)) {
        const parentId = mainCategoryMap[mainCategory];

        // Make sure we found the parent category
        if (!parentId) {
          console.warn(
            `Parent category "${mainCategory}" not found, skipping subcategories`
          );
          continue;
        }

        for (const subcategory of subcategories[mainCategory]) {
          // Create slug for the subcategory
          const slug = createSlug(subcategory);

          // Generate description
          const description = generateCategoryDescription(subcategory);

          // Generate a generic image URL for the category
          const imageUrl = `../assets/category/${slug}/category-thumbnail.jpg`;

          const sql = `
            INSERT INTO categories (name, slug, description, image_url, parent_id, is_featured) 
            VALUES (?, ?, ?, ?, ?, ?)
          `;

          await pool.query(sql, [
            subcategory,
            slug,
            description,
            imageUrl,
            parentId,
            false, // Subcategories are not featured by default
          ]);

          console.log(
            `Added subcategory: ${subcategory} (parent: ${mainCategory})`
          );
        }
      }
    }

    console.log('Categories seeded successfully!');
  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    await pool.end();
  }
}

// Run the seeder
seedCategories()
  .then(() => {
    console.log('Categories seeding completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error during categories seeding:', err);
    process.exit(1);
  });
