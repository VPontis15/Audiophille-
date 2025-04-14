const { faker } = require('@faker-js/faker');
const { pool } = require('../config/config');

// Realistic audio brands list - combination of real and fictional
const audioBrands = [
  // Real well-known brands
  { name: 'Sennheiser', isPopular: true, country: 'Germany' },
  { name: 'Bose', isPopular: true, country: 'USA' },
  { name: 'Sony', isPopular: true, country: 'Japan' },
  { name: 'Audio-Technica', isPopular: true, country: 'Japan' },
  { name: 'Beyerdynamic', isPopular: true, country: 'Germany' },
  { name: 'JBL', isPopular: true, country: 'USA' },
  { name: 'Shure', isPopular: true, country: 'USA' },
  { name: 'AKG', isPopular: true, country: 'Austria' },
  { name: 'Focal', isPopular: true, country: 'France' },
  { name: 'Grado', isPopular: true, country: 'USA' },

  // Fictional brands from your existing seed file
  { name: 'SoundWave', isPopular: false, country: 'USA' },
  { name: 'AudioPeak', isPopular: false, country: 'UK' },
  { name: 'BassLine', isPopular: false, country: 'Canada' },
  { name: 'CrystalSound', isPopular: false, country: 'Japan' },
  { name: 'SonicTech', isPopular: false, country: 'South Korea' },
  { name: 'PulseAudio', isPopular: false, country: 'Denmark' },
  { name: 'RhythmBox', isPopular: false, country: 'USA' },
  { name: 'HarmonyAudio', isPopular: false, country: 'Sweden' },
  { name: 'EchoWave', isPopular: false, country: 'France' },
  { name: 'ResonanceLab', isPopular: false, country: 'Germany' },
  { name: 'AuralSonic', isPopular: false, country: 'Italy' },
  { name: 'MelodicWave', isPopular: false, country: 'Netherlands' },
  { name: 'PrecisionSound', isPopular: false, country: 'Switzerland' },
  { name: 'VibeTech', isPopular: false, country: 'Australia' },
  { name: 'AcousticEdge', isPopular: false, country: 'New Zealand' },
];

// Create descriptions for the brands
function generateBrandDescription(brand) {
  const yearFounded = faker.number.int({ min: 1950, max: 2015 });

  const descriptions = [
    `Founded in ${yearFounded}, ${
      brand.name
    } has been creating premium audio equipment for ${
      2023 - yearFounded
    } years. Known for their exceptional sound quality and durability, they continue to innovate in the ${faker.helpers.arrayElement(
      ['consumer', 'professional', 'audiophile']
    )} audio market.`,

    `${brand.name} was established in ${yearFounded} in ${
      brand.country
    }. Their commitment to audio excellence has made them ${
      brand.isPopular ? 'a household name' : 'a respected brand'
    } among ${faker.helpers.arrayElement([
      'music producers',
      'audiophiles',
      'sound engineers',
      'casual listeners',
    ])}.`,

    `With origins dating back to ${yearFounded}, ${
      brand.name
    } specializes in ${faker.helpers.arrayElement([
      'high-fidelity audio reproduction',
      'studio-quality sound equipment',
      'premium consumer audio',
      'innovative acoustic technologies',
    ])}. Based in ${
      brand.country
    }, they've developed a reputation for ${faker.helpers.arrayElement([
      'uncompromising quality',
      'cutting-edge design',
      'exceptional value',
      'technical innovation',
    ])}.`,

    `${
      brand.name
    } began their journey in ${yearFounded} with a mission to ${faker.helpers.arrayElement(
      [
        'revolutionize how we experience sound',
        'make professional audio accessible to everyone',
        'create the perfect listening experience',
        'push the boundaries of audio technology',
      ]
    )}. Today, they're known for their ${faker.helpers.arrayElement([
      'signature sound profile',
      'meticulous craftsmanship',
      'industry-leading innovations',
      'award-winning designs',
    ])}.`,
  ];

  return faker.helpers.arrayElement(descriptions);
}

// Generate slug from brand name
function generateSlug(brandName) {
  return brandName
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove consecutive hyphens
}

async function seedBrands() {
  try {
    console.log('Seeding brands...');

    for (const brand of audioBrands) {
      // Check if brand already exists
      const [existingBrands] = await pool.query(
        'SELECT id FROM brands WHERE name = ?',
        [brand.name]
      );

      if (existingBrands.length > 0) {
        console.log(`Brand "${brand.name}" already exists, skipping...`);
        continue;
      }

      const brandData = {
        name: brand.name,
        description: generateBrandDescription(brand),
        country: brand.country,
        isPopular: brand.isPopular,
        slug: generateSlug(brand.name), // Generate slug from name
        logo: faker.image.urlLoremFlickr({ category: 'logo' }),
        website: `https://www.${brand.name
          .toLowerCase()
          .replace(/\s+/g, '')}.com`,
      };

      const sql = `INSERT INTO brands SET ?`;
      await pool.query(sql, brandData);
      console.log(`Added brand: ${brand.name} (slug: ${brandData.slug})`);
    }

    console.log('Brands seeded successfully!');
  } catch (error) {
    console.error('Error seeding brands:', error);
  } finally {
    await pool.end();
  }
}

// Run the seeder
seedBrands()
  .then(() => {
    console.log('Brand seeding completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error during brand seeding:', err);
    process.exit(1);
  });
