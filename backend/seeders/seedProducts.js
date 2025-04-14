const { faker } = require('@faker-js/faker');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Load real products from data.json if it exists
let realProducts = [];
try {
  const dataPath = path.join(__dirname, 'data.json');
  if (fs.existsSync(dataPath)) {
    realProducts = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log(`Loaded ${realProducts.length} real products from data.json`);
  }
} catch (error) {
  console.error('Error loading real products:', error);
}

// Helper functions to get category and brand IDs
async function getCategoryIdByName(categoryName) {
  try {
    // Try to find existing category
    let category = await prisma.categories.findFirst({
      where: { name: categoryName },
    });

    if (!category) {
      console.log(`Category not found: ${categoryName}, creating it...`);
      // Insert the category with required fields
      category = await prisma.categories.create({
        data: {
          name: categoryName,
          slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
          description: `${categoryName} products`, // Add a basic description
        },
      });
    }

    return category.id;
  } catch (error) {
    console.error(
      `Error getting/creating category ID for ${categoryName}:`,
      error
    );
    throw error;
  }
}

async function getBrandIdByName(brandName) {
  try {
    // Try to find existing brand
    let brand = await prisma.brands.findFirst({
      where: { name: brandName },
    });

    if (!brand) {
      console.log(`Brand not found: ${brandName}, creating it...`);
      // Insert the brand with required fields
      brand = await prisma.brands.create({
        data: {
          name: brandName,
          slug: brandName.toLowerCase().replace(/\s+/g, '-'),
          description: `${brandName} is a premium audio equipment manufacturer.`,
          country: 'United States', // Default country
        },
      });
    }

    return brand.id;
  } catch (error) {
    console.error(`Error getting/creating brand ID for ${brandName}:`, error);
    throw error;
  }
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

// Audio specifications generators
function generateFrequencyResponse(category) {
  const lowFreq = faker.helpers.arrayElement(['5', '10', '15', '20', '25']);
  const highFreq = faker.helpers.arrayElement([
    '20',
    '22',
    '24',
    '30',
    '40',
    '50',
  ]);

  return `${lowFreq}Hz - ${highFreq}kHz`;
}

function generateImpedance() {
  return `${faker.helpers.arrayElement([
    '16',
    '32',
    '50',
    '64',
    '80',
    '100',
    '250',
    '300',
  ])} Ohms`;
}

function generateConnectivity() {
  const options = [
    'Bluetooth 5.0',
    'Bluetooth 5.1',
    'Bluetooth 5.2',
    'Bluetooth 5.3',
    'Wired (3.5mm)',
    'Wired (USB-C)',
    'Wired & Bluetooth',
    'USB-C & Bluetooth',
    'Wi-Fi & Bluetooth',
    'LDAC & Bluetooth',
    'aptX HD & Bluetooth',
  ];

  return faker.helpers.arrayElement(options);
}

function generateBatteryLife(category) {
  if (category === 'speakers') {
    return `${faker.number.int({ min: 8, max: 24 })} hours`;
  } else {
    return `${faker.number.int({ min: 4, max: 80 })} hours`;
  }
}

function generateColor() {
  return faker.helpers.arrayElement([
    'Black',
    'White',
    'Silver',
    'Space Gray',
    'Navy Blue',
    'Midnight Black',
    'Rose Gold',
    'Carbon Black',
    'Ivory White',
    'Graphite',
    'Matte Black',
    'Titanium',
  ]);
}

function generateWarranty() {
  return `${faker.helpers.arrayElement([
    '1',
    '2',
    '3',
    '5',
  ])} year${faker.helpers.arrayElement(['', 's'])}`;
}

function generateSKU(brandName, category, productNumber) {
  const brandPrefix = brandName.substring(0, 3).toUpperCase();
  const categoryPrefix = category.substring(0, 2).toUpperCase();
  const randomNum = faker.string.numeric(4);

  return `${brandPrefix}-${categoryPrefix}${randomNum}`;
}

function generateWeight(category) {
  if (category === 'headphones') {
    return `${faker.number.int({ min: 180, max: 450 })}g`;
  } else if (category === 'earphones') {
    return `${faker.number.int({ min: 4, max: 15 })}g (each)`;
  } else {
    return `${faker.number.float({ min: 0.5, max: 5.0, precision: 0.1 })}kg`;
  }
}

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

async function seedProducts() {
  try {
    console.log('Seeding products...');

    // First, check if categories and brands exist
    const categoriesCount = await prisma.categories.count();
    if (categoriesCount === 0) {
      throw new Error(
        'No categories found. Please run the category seeder first.'
      );
    }

    const brandsCount = await prisma.brands.count();
    if (brandsCount === 0) {
      throw new Error('No brands found. Please run the brand seeder first.');
    }

    // Seed real products first (if any)
    for (const product of realProducts) {
      try {
        // Get or create category ID
        const categoryId = await getCategoryIdByName(product.category);

        // Get or create brand ID
        const brandId = await getBrandIdByName(product.brand);

        // Now add these IDs to the product data
        const productData = {
          ...product,
          // Use the correct Prisma relation syntax
          categories: {
            connect: { id: categoryId },
          },
          brands: {
            connect: { id: brandId },
          },
        };

        // Remove any properties that aren't in the database schema
        delete productData.id; // In case it has an ID already
        delete productData.category; // Remove the string category name
        delete productData.brand; // Remove the string brand name

        // Insert the product with proper IDs
        await prisma.products.create({
          data: productData,
        });
        console.log(`Added real product: ${product.name}`);
      } catch (error) {
        console.error(`Error adding real product ${product.name}:`, error);
      }
    }

    // Then generate additional fake products if needed
    const productsCount = await prisma.products.count();
    const remainingCount = 500 - productsCount;

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

        const brandName = faker.helpers.arrayElement(audioBrands);
        const productName = generateAudioProductName(category);

        // Get category and brand IDs
        const categoryId = await getCategoryIdByName(category);
        const brandId = await getBrandIdByName(brandName);

        // Check if product is on sale
        const isOnSale = faker.datatype.boolean(0.4);
        const price = parseFloat(faker.commerce.price({ min: 49, max: 2999 }));
        const salePrice = isOnSale
          ? parseFloat((price * 0.8).toFixed(2))
          : null; // 20% off
        const discountType = isOnSale
          ? faker.helpers.arrayElement(['fixed', 'percentage'])
          : 'none';

        // Update the product object to use the correct Prisma relation syntax
        const product = {
          name: productName,
          description: generateAudioDescription(category),
          price,
          gallery: JSON.stringify(galleryImages),
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
          isOnSale,
          salePrice,
          discountType,
          saleEndDate: isOnSale ? faker.date.future() : null,
          numReviews: faker.number.int({ min: 0, max: 250 }),
          packageContents: JSON.stringify(
            generatePackageContents(category, brandName)
          ),
          status: 'published',
          // Use the Prisma relation syntax instead of direct IDs
          categories: {
            connect: { id: categoryId },
          },
          brands: {
            connect: { id: brandId },
          },

          // New audio-specific fields
          sku: generateSKU(brandName, category, i),
          weight: generateWeight(category),
          frequencyResponse: generateFrequencyResponse(category),
          impedance: category !== 'speakers' ? generateImpedance() : null,
          connectivity: generateConnectivity(),
          batteryLife:
            category !== 'speakers' ? generateBatteryLife(category) : null,
          warranty: generateWarranty(),

          // Create related products (array of IDs 1-10)
          relatedProducts: JSON.stringify(
            Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () =>
              faker.number.int({ min: 1, max: 10 })
            )
          ),
        };

        await prisma.products.create({
          data: product,
        });

        if ((i + 1) % 50 === 0 || i === remainingCount - 1) {
          console.log(`Added ${i + 1}/${remainingCount} generated products`);
        }
      }
    }

    console.log('Products seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts()
  .then(() => console.log('Products seeding completed'))
  .catch((err) => console.error('Products seeding failed:', err));
