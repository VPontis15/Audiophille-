const { faker } = require('@faker-js/faker');
const { pool } = require('../config/config');
const fs = require('fs');
const path = require('path');

// Load real product data
let realProductsData = [];
try {
  const jsonData = fs.readFileSync(
    path.join(__dirname, '..', 'data.json'),
    'utf8'
  );
  realProductsData = JSON.parse(jsonData);
  console.log(`Loaded ${realProductsData.length} real products from data.json`);
} catch (error) {
  console.error('Error loading real products data:', error);
}

// Audio product-specific data
const productPrefixes = [
  'Pro',
  'Elite',
  'Ultra',
  'Premium',
  'Studio',
  'Bass',
  'Noise-Cancelling',
  'Wireless',
  'Bluetooth',
  'Hi-Fi',
  'Digital',
  'Audiophile',
  'Classic',
  'Reference',
  'Signature',
  'Performance',
  'Gaming',
];

const headphoneNames = [
  'Monitor Headphones',
  'Over-Ear Headphones',
  'DJ Headphones',
  'Studio Headphones',
  'Gaming Headset',
  'Professional Headphones',
  'Closed-Back Headphones',
  'Open-Back Headphones',
  'Wireless Headphones',
  'Bluetooth Headphones',
  'Noise-Cancelling Headphones',
];

const earphoneNames = [
  'Earbuds',
  'In-Ear Monitors',
  'True Wireless Earbuds',
  'Sport Earphones',
  'Wireless Earphones',
  'Noise-Isolating Earphones',
  'Bluetooth Earphones',
  'Premium Earbuds',
  'Studio Earphones',
  'Bass Earphones',
];

const speakerNames = [
  'Bluetooth Speaker',
  'Wireless Speaker',
  'Smart Speaker',
  'Bookshelf Speakers',
  'Floor Standing Speakers',
  'Portable Speaker',
  'Subwoofer',
  'Soundbar',
  'Multi-Room Speaker',
  'Studio Monitors',
  'Party Speaker',
  'Home Theater System',
];

const audioBrands = [
  'SoundWave',
  'AudioPeak',
  'BassLine',
  'CrystalSound',
  'SonicTech',
  'PulseAudio',
  'RhythmBox',
  'HarmonyAudio',
  'EchoWave',
  'ResonanceLab',
  'AuralSonic',
  'MelodicWave',
  'PrecisionSound',
  'VibeTech',
  'AcousticEdge',
];

// Update the generateThumbnailUrl function to use 80x80 instead of 56x56
function generateThumbnailUrl(imageUrl, alt) {
  // Extract the base URL without query parameters
  const baseUrl = imageUrl.split('?')[0];

  // For picsum.photos, create a specific 80x80 thumbnail (increased from 56x56)
  if (baseUrl.includes('picsum.photos')) {
    const urlParts = baseUrl.split('/');
    const imageId = urlParts[urlParts.indexOf('id') + 1];
    // Add a cache buster to ensure unique thumbnails
    const cacheBuster = Date.now() + Math.floor(Math.random() * 1000);
    return `https://picsum.photos/id/${imageId}/80/80?${cacheBuster}`;
  }

  // This is a simple fallback
  return baseUrl.replace(/\/([^\/]+)$/, '/thumbnail-$1');
}

// Update the getCategoryImages function to use 80x80 for thumbnails
function getCategoryImages(category, identifier = '') {
  // Curated lists of image IDs that look like tech/audio products
  const headphoneImageIds = [
    15, 27, 28, 36, 60, 65, 106, 119, 160, 180, 191, 238, 239, 244, 338, 367,
    447, 504, 513, 532,
  ];
  const earphoneImageIds = [
    25, 26, 30, 42, 61, 64, 68, 103, 110, 170, 201, 256, 331, 403, 445, 449,
    493, 514, 529, 557,
  ];
  const speakerImageIds = [
    3, 14, 29, 45, 58, 76, 109, 120, 130, 159, 181, 250, 264, 341, 361, 429,
    468, 494, 519, 534,
  ];

  // Select a random ID from the appropriate category list
  let imageId;
  switch (category) {
    case 'headphones':
      imageId = faker.helpers.arrayElement(headphoneImageIds);
      break;
    case 'earphones':
      imageId = faker.helpers.arrayElement(earphoneImageIds);
      break;
    case 'speakers':
      imageId = faker.helpers.arrayElement(speakerImageIds);
      break;
    default:
      // Combine all arrays for a default case
      imageId = faker.helpers.arrayElement([
        ...headphoneImageIds,
        ...earphoneImageIds,
        ...speakerImageIds,
      ]);
  }

  // Add a random parameter to ensure browsers don't cache the same image
  const cacheBuster = Date.now() + Math.floor(Math.random() * 1000);

  // Use a specific format to make the images look more like product images
  return {
    desktopUrl: `https://picsum.photos/id/${imageId}/1980/1080?${cacheBuster}`,
    tabletUrl: `https://picsum.photos/id/${imageId}/1378/704?${cacheBuster}`,
    mobileUrl: `https://picsum.photos/id/${imageId}/654/736?${cacheBuster}`,
    thumbnailUrl: `https://picsum.photos/id/${imageId}/80/80?${cacheBuster}`,
    keyword: category,
  };
}

// Generate realistic product names for audio equipment
function generateAudioProductName(category) {
  const prefix = faker.helpers.arrayElement(productPrefixes);
  const brand = faker.helpers.arrayElement(audioBrands);

  let productType;
  switch (category) {
    case 'headphones':
      productType = faker.helpers.arrayElement(headphoneNames);
      break;
    case 'earphones':
      productType = faker.helpers.arrayElement(earphoneNames);
      break;
    case 'speakers':
      productType = faker.helpers.arrayElement(speakerNames);
      break;
    default:
      productType = faker.helpers.arrayElement([
        ...headphoneNames,
        ...earphoneNames,
        ...speakerNames,
      ]);
  }

  // Format: [Brand] [Prefix] [Model Number] [Product Type]
  return `${brand} ${prefix} ${faker.string
    .alphanumeric(2)
    .toUpperCase()}${faker.number.int({ min: 10, max: 999 })} ${productType}`;
}

// Replace the generateAudioDescription function with this improved version
function generateAudioDescription(category) {
  // Product-specific introductions by category
  const introsByCategory = {
    headphones: [
      'Immerse yourself in crystal-clear sound with these premium headphones.',
      'Experience music like never before with these studio-quality headphones.',
      'These professional-grade headphones deliver exceptional audio fidelity.',
      'Enjoy superior comfort and sound isolation with these over-ear headphones.',
      'Designed for audiophiles who demand the finest listening experience.',
    ],
    earphones: [
      'These compact earphones deliver incredible sound in a portable package.',
      'Experience rich bass and clear treble with these premium earbuds.',
      'Designed for active lifestyles, these earphones stay secure during any activity.',
      'Enjoy wireless freedom with these true wireless earbuds.',
      'These in-ear monitors provide studio-quality sound on the go.',
    ],
    speakers: [
      'Fill your room with immersive, high-fidelity sound from these premium speakers.',
      'These powerful speakers deliver room-filling sound with minimal distortion.',
      'Designed for audiophiles, these speakers reveal every detail in your music.',
      'Experience concert-quality sound in your home with these advanced speakers.',
      'These versatile speakers adapt perfectly to any room acoustics.',
    ],
  };

  // Select a random introduction appropriate for the category
  const intro = faker.helpers.arrayElement(
    introsByCategory[category] || introsByCategory.headphones
  );

  // Generate category-specific features
  let features = [];

  // Common features with more variation
  if (faker.datatype.boolean(0.7)) {
    features.push(
      `${faker.number.int({ min: 20, max: 50 })}mm ${faker.helpers.arrayElement(
        [
          'neodymium',
          'titanium',
          'beryllium',
          'graphene',
          'dynamic',
          'planar magnetic',
          'custom-tuned',
          'bio-cellulose',
        ]
      )} drivers for exceptional sound clarity`
    );
  }

  if (faker.datatype.boolean(0.8)) {
    features.push(
      `${faker.helpers.arrayElement([
        'Premium',
        'High-quality',
        'Luxurious',
        'Comfortable',
        'Ergonomic',
        'Lightweight',
        'Durable',
        'Sleek',
      ])} ${faker.helpers.arrayElement([
        'design',
        'construction',
        'build quality',
        'materials',
        'finish',
      ])}`
    );
  }

  if (faker.datatype.boolean(0.6) && category !== 'speakers') {
    features.push(
      `${faker.helpers.arrayElement([
        'Up to',
        'Over',
        'Around',
        'A remarkable',
        'An impressive',
      ])} ${faker.number.int({
        min: 15,
        max: 80,
      })} hours of ${faker.helpers.arrayElement([
        'battery life',
        'playback time',
        'continuous listening',
        'wireless operation',
      ])}`
    );
  }

  // Category-specific features with more detail and variation
  if (category === 'headphones') {
    if (faker.datatype.boolean(0.8)) {
      features.push(
        `${faker.helpers.arrayElement([
          'Active',
          'Passive',
          'Hybrid',
          'Adaptive',
          'Digital',
          'Multi-level',
          'Advanced',
        ])} noise ${faker.helpers.arrayElement([
          'cancellation',
          'isolation',
          'reduction',
          'blocking technology',
        ])} for ${faker.helpers.arrayElement([
          'immersive listening',
          'distraction-free audio',
          'focus in noisy environments',
          'peaceful enjoyment',
        ])}`
      );
    }

    if (faker.datatype.boolean(0.7)) {
      features.push(
        `${faker.helpers.arrayElement([
          'Memory foam',
          'Premium leather',
          'Velour',
          'Breathable mesh',
          'Protein leather',
          'Alcantara',
          'Microfiber',
          'Cooling gel-infused',
        ])} ear cushions for ${faker.helpers.arrayElement([
          'extended comfort',
          'all-day wear',
          'reduced fatigue',
          'optimal sound isolation',
        ])}`
      );
    }

    if (faker.datatype.boolean(0.5)) {
      features.push(
        `${faker.helpers.arrayElement([
          'Foldable',
          'Collapsible',
          'Compact',
          'Travel-friendly',
        ])} design with ${faker.helpers.arrayElement([
          'included carrying case',
          'protective pouch',
          'hard shell case',
          'premium travel bag',
        ])}`
      );
    }
  } else if (category === 'earphones') {
    if (faker.datatype.boolean(0.8)) {
      features.push(
        `${faker.helpers.arrayElement([
          'IPX4',
          'IPX5',
          'IPX7',
          'IPX8',
          'IP55',
          'IP67',
        ])} ${faker.helpers.arrayElement([
          'water resistance',
          'water and sweat resistance',
          'waterproofing',
          'protection against moisture',
        ])} for ${faker.helpers.arrayElement([
          'workouts',
          'active use',
          'all weather conditions',
          'reliable performance',
        ])}`
      );
    }

    if (faker.datatype.boolean(0.7)) {
      features.push(
        `${faker.number.int({ min: 3, max: 8 })} ${faker.helpers.arrayElement([
          'different ear tip sizes',
          'sets of ear tips',
          'silicone tip options',
          'custom fit options',
        ])} ${faker.helpers.arrayElement([
          'for a perfect fit',
          'to ensure comfort',
          'for optimal sound isolation',
          'included in the package',
        ])}`
      );
    }

    if (faker.datatype.boolean(0.6)) {
      features.push(
        `${faker.helpers.arrayElement([
          'Touch',
          'Capacitive',
          'Smart',
          'Intuitive',
          'Customizable',
        ])} controls for ${faker.helpers.arrayElement([
          'easy operation',
          'music and call management',
          'volume and playback',
          'hands-free control',
        ])}`
      );
    }
  } else if (category === 'speakers') {
    if (faker.datatype.boolean(0.8)) {
      features.push(
        `${faker.number.int({
          min: 30,
          max: 500,
        })}W ${faker.helpers.arrayElement([
          'output power',
          'peak power',
          'total power',
          'audio output',
        ])} for ${faker.helpers.arrayElement([
          'room-filling sound',
          'powerful audio',
          'dynamic range',
          'impressive volume',
        ])}`
      );
    }

    if (faker.datatype.boolean(0.7)) {
      features.push(
        `${faker.helpers.arrayElement([
          '360°',
          'Stereo',
          'Surround',
          'Multi-directional',
          'Omnidirectional',
          'Full-range',
          'Hi-Fi',
        ])} sound ${faker.helpers.arrayElement([
          'dispersion',
          'projection',
          'quality',
          'technology',
        ])} for ${faker.helpers.arrayElement([
          'immersive listening',
          'room-filling audio',
          'consistent sound throughout your space',
          'the perfect soundstage',
        ])}`
      );
    }

    if (faker.datatype.boolean(0.6)) {
      features.push(
        `${faker.helpers.arrayElement([
          'Multi-room',
          'Party-chain',
          'Stereo pairing',
          'Wireless linking',
        ])} capability ${faker.helpers.arrayElement([
          'to expand your system',
          'for whole-home audio',
          'to create a wider soundstage',
          'for bigger sound',
        ])}`
      );
    }
  }

  // Add connectivity options with variation
  if (faker.datatype.boolean(0.9)) {
    features.push(
      `${faker.helpers.arrayElement([
        'Bluetooth',
        'Wireless',
        'Advanced Bluetooth',
        'High-definition Bluetooth',
      ])} ${faker.helpers.arrayElement([
        '5.0',
        '5.1',
        '5.2',
        '5.3',
      ])} ${faker.helpers.arrayElement([
        'connectivity',
        'technology',
        'with aptX HD support',
        'with LDAC support',
        'with AAC support',
        'with multi-point connection',
      ])}`
    );
  }

  // Add occasional unique features
  if (faker.datatype.boolean(0.3)) {
    features.push(
      faker.helpers.arrayElement([
        'Built-in voice assistant compatibility',
        'Customizable EQ settings via companion app',
        'Fast charging capability for quick power top-ups',
        'Premium aluminum construction for durability',
        'Auto-pause when removed from ears',
        'Ambient sound mode for environmental awareness',
        'USB-C and analog connectivity options',
        'Advanced DSP for precision audio enhancement',
        'Hi-Res Audio certification for lossless sound quality',
        'Customizable LED lighting effects',
        'Auto room calibration for optimal sound',
        'Rich, detailed mids and clear highs',
      ])
    );
  }

  // Final sentence with more variation
  const closingSentences = [
    `Perfect for ${faker.helpers.arrayElement([
      'audiophiles',
      'music lovers',
      'professionals',
      'everyday listening',
    ])}.`,
    `Elevate your listening experience with premium sound engineering.`,
    `Designed and tuned by award-winning sound engineers.`,
    `Crafted with precision to deliver exceptional audio quality.`,
    `Experience your music the way the artist intended.`,
    `Redefine your expectations of what ${category} can sound like.`,
  ];

  // Combine all parts into a cohesive description
  return `${intro} ${features.join('. ')}. ${faker.helpers.arrayElement(
    closingSentences
  )}`;
}

// Add this function to generate package contents
function generatePackageContents(category, brand) {
  const contents = [];

  // Items common to all categories
  contents.push(`1 x ${brand} ${category}`);
  contents.push('1 x User Manual');
  contents.push('1 x Warranty Card');

  // Category-specific items
  if (category === 'headphones') {
    contents.push('1 x Carrying Case');
    contents.push('1 x 3.5mm Audio Cable');
    contents.push(
      `1 x USB-${faker.helpers.arrayElement([
        'A',
        'C',
      ])}-to-USB-${faker.helpers.arrayElement(['A', 'C'])} Charging Cable`
    );

    if (faker.datatype.boolean(0.6)) {
      contents.push('1 x Airplane Adapter');
    }

    if (faker.datatype.boolean(0.4)) {
      contents.push('1 x 1/4" Adapter');
    }
  } else if (category === 'earphones') {
    contents.push(
      `${faker.number.int({ min: 3, max: 5 })} x Pairs of Ear Tips (S, M, L${
        faker.datatype.boolean(0.5) ? ', XL' : ''
      })`
    );
    contents.push('1 x Charging Case');
    contents.push(
      `1 x USB-${faker.helpers.arrayElement([
        'A',
        'C',
      ])}-to-USB-${faker.helpers.arrayElement(['A', 'C'])} Charging Cable`
    );

    if (faker.datatype.boolean(0.3)) {
      contents.push('1 x Carabiner Clip');
    }
  } else if (category === 'speakers') {
    contents.push('1 x Power Adapter');
    contents.push(
      `1 x Remote Control${
        faker.datatype.boolean(0.7) ? ' with Batteries' : ''
      }`
    );

    if (faker.datatype.boolean(0.5)) {
      contents.push('1 x 3.5mm Audio Cable');
    }

    if (faker.datatype.boolean(0.3)) {
      contents.push('1 x Optical Cable');
    }

    if (faker.datatype.boolean(0.2)) {
      contents.push('1 x Wall Mounting Kit');
    }
  }

  return contents;
}

async function seedProducts(count = 500) {
  try {
    console.log(`Seeding products...`);

    // First seed the real products from data.json
    for (const productData of realProductsData) {
      // Convert the real product data to match your database schema
      const gallery = [
        {
          desktop: {
            url: productData.gallery.first.desktop,
            alt: `${productData.name} gallery image 1 - desktop`,
          },
          tablet: {
            url: productData.gallery.first.tablet,
            alt: `${productData.name} gallery image 1 - tablet`,
          },
          mobile: {
            url: productData.gallery.first.mobile,
            alt: `${productData.name} gallery image 1 - mobile`,
          },
          thumbnail: {
            url: generateThumbnailUrl(
              productData.gallery.first.mobile,
              productData.name
            ),
            alt: `${productData.name} gallery image 1 - thumbnail`,
          },
        },
        {
          desktop: {
            url: productData.gallery.second.desktop,
            alt: `${productData.name} gallery image 2 - desktop`,
          },
          tablet: {
            url: productData.gallery.second.tablet,
            alt: `${productData.name} gallery image 2 - tablet`,
          },
          mobile: {
            url: productData.gallery.second.mobile,
            alt: `${productData.name} gallery image 2 - mobile`,
          },
          thumbnail: {
            url: generateThumbnailUrl(
              productData.gallery.second.mobile,
              productData.name
            ),
            alt: `${productData.name} gallery image 2 - thumbnail`,
          },
        },
        {
          desktop: {
            url: productData.gallery.third.desktop,
            alt: `${productData.name} gallery image 3 - desktop`,
          },
          tablet: {
            url: productData.gallery.third.tablet,
            alt: `${productData.name} gallery image 3 - tablet`,
          },
          mobile: {
            url: productData.gallery.third.mobile,
            alt: `${productData.name} gallery image 3 - mobile`,
          },
          thumbnail: {
            url: generateThumbnailUrl(
              productData.gallery.third.mobile,
              productData.name
            ),
            alt: `${productData.name} gallery image 3 - thumbnail`,
          },
        },
      ];

      // Add thumbnail to featured image
      const featuredImage = {
        desktop: {
          url: productData.image.desktop,
          alt: `${productData.name} - desktop`,
        },
        tablet: {
          url: productData.image.tablet,
          alt: `${productData.name} - tablet`,
        },
        mobile: {
          url: productData.image.mobile,
          alt: `${productData.name} - mobile`,
        },
        thumbnail: {
          url: generateThumbnailUrl(productData.image.mobile, productData.name),
          alt: `${productData.name} - thumbnail`,
        },
      };

      // Convert package contents
      const packageContents = productData.includes.map(
        (item) => `${item.quantity} x ${item.item}`
      );

      // Convert related products
      const relatedProducts = productData.others.map((product) => ({
        slug: product.slug,
        name: product.name,
        image: product.image,
      }));

      const product = {
        name: productData.name,
        status: 'published',
        description: productData.description,
        price: productData.price,
        gallery: JSON.stringify(gallery),
        brand: productData.name.split(' ')[0], // Extract brand from name
        category: productData.category,
        quantity: faker.number.int({ min: 10, max: 50 }),
        rating: parseFloat(
          faker.number.float({ min: 4.0, max: 5.0, precision: 0.1 })
        ),
        slug: productData.slug,
        collection: faker.helpers.arrayElement([
          'premium',
          'standard',
          'budget',
        ]),
        isFeatured: productData.new,
        featuredImage: JSON.stringify(featuredImage),
        isNewArrival: productData.new,
        isBestSeller: faker.datatype.boolean(0.3),
        isOnSale: faker.datatype.boolean(0.3),
        packageContents: JSON.stringify(packageContents),
        numReviews: faker.number.int({ min: 5, max: 120 }),
        relatedProducts: JSON.stringify(relatedProducts),
      };

      // Add sale price if on sale
      if (product.isOnSale) {
        product.salePrice = parseFloat((product.price * 0.8).toFixed(2));
        product.saleEndDate = faker.date.future();
      }

      const sql = `INSERT INTO products SET ?`;
      await pool.query(sql, product);
      console.log(`Added real product: ${product.name}`);
    }

    // Then generate additional fake products to reach the desired count
    const remainingCount = count - realProductsData.length;
    if (remainingCount > 0) {
      console.log(`Generating ${remainingCount} additional products...`);

      for (let i = 0; i < remainingCount; i++) {
        // Choose a category first
        const category = faker.helpers.arrayElement([
          'headphones',
          'speakers',
          'earphones',
        ]);

        // Get category-specific image URLs for the featured image with thumbnails
        const featuredImageData = getCategoryImages(category, 'featured-');
        const featuredImageSet = {
          desktop: {
            url: featuredImageData.desktopUrl,
            alt: `Featured ${category} - desktop`,
          },
          tablet: {
            url: featuredImageData.tabletUrl,
            alt: `Featured ${category} - tablet`,
          },
          mobile: {
            url: featuredImageData.mobileUrl,
            alt: `Featured ${category} - mobile`,
          },
          thumbnail: {
            url: featuredImageData.thumbnailUrl,
            alt: `Featured ${category} - thumbnail`,
          },
        };

        const galleryImages = [];
        // Create 3 gallery images with different views, including thumbnails
        for (let view = 1; view <= 3; view++) {
          const galleryImageData = getCategoryImages(category, `view${view}-`);
          galleryImages.push({
            desktop: {
              url: galleryImageData.desktopUrl,
              alt: `${category} view ${view} - desktop`,
            },
            tablet: {
              url: galleryImageData.tabletUrl,
              alt: `${category} view ${view} - tablet`,
            },
            mobile: {
              url: galleryImageData.mobileUrl,
              alt: `${category} view ${view} - mobile`,
            },
            thumbnail: {
              url: galleryImageData.thumbnailUrl,
              alt: `${category} view ${view} - thumbnail`,
            },
          });
        }

        const brand = faker.helpers.arrayElement(audioBrands);
        const productName = generateAudioProductName(category);

        const product = {
          name: productName,
          description: generateAudioDescription(category),
          price: parseFloat(faker.commerce.price({ min: 49, max: 2999 })),
          gallery: JSON.stringify(galleryImages),
          brand: brand,
          category: category,
          quantity: faker.number.int({ min: 0, max: 100 }),
          rating: parseFloat(
            faker.number.float({ min: 1, max: 5, precision: 0.1 })
          ),
          slug: faker.helpers.slugify(productName).toLowerCase(),
          collection: faker.helpers.arrayElement([
            'premium',
            'standard',
            'budget',
          ]),
          isFeatured: faker.datatype.boolean(0.3),
          featuredImage: JSON.stringify(featuredImageSet),
          isNewArrival: faker.datatype.boolean(0.2),
          isBestSeller: faker.datatype.boolean(0.25),
          isOnSale: faker.datatype.boolean(0.4),
          numReviews: faker.number.int({ min: 0, max: 250 }),
          packageContents: JSON.stringify(
            generatePackageContents(category, brand)
          ),
        };

        // Add sale price and end date only if the product is on sale
        if (product.isOnSale) {
          product.salePrice = parseFloat((product.price * 0.8).toFixed(2)); // 20% off
          product.saleEndDate = faker.date.future();
        }

        // Create related products (array of IDs 1-10)
        product.relatedProducts = JSON.stringify(
          Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () =>
            faker.number.int({ min: 1, max: 10 })
          )
        );

        const sql = `INSERT INTO products SET ?`;
        await pool.query(sql, product);

        if ((i + 1) % 50 === 0 || i === remainingCount - 1) {
          console.log(`Added ${i + 1}/${remainingCount} generated products`);
        }
      }
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await pool.end();
  }
}

// Run the seeder with default count of fake products (plus the real ones)
seedProducts(process.argv[2] || 500)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
