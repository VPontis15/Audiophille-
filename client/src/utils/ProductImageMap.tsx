/**
 * Utility for accessing product images using the hashed filenames that work in production
 */

// Map of product slugs to their corresponding hashed image filenames
const productImageMap: Record<string, string> = {
  'xx59-headphones': 'image-product-L7aUjZlB.jpg',
  'xx99-mark-one-headphones': 'image-product-L7aUjZlB.jpg',
  'xx99-mark-two-headphones': 'image-product-L7aUjZlB.jpg',
  'yx1-earphones': 'image-product-CFsmp4vM.jpg',
  'zx7-speaker': 'image-product-Cbv3709_.jpg',
  'zx9-speaker': 'image-product-Cbv3709_.jpg'
};

// Gallery image mappings by category
const galleryImageMap: Record<string, Record<string, string>> = {
  'headphones': {
    'gallery-1': 'image-gallery-1-C2zPPYwa.jpg',
    'gallery-2': 'image-gallery-2-DDlRxYzw.jpg',
    'gallery-3': 'image-gallery-3-B9brn9E0.jpg'
  },
  'earphones': {
    'gallery-1': 'image-gallery-1-Qy07vxVZ.jpg',
    'gallery-2': 'image-gallery-2-Ba8JQFCT.jpg',
    'gallery-3': 'image-gallery-3-_-1-sqnH.jpg'
  },
  'speakers': {
    'gallery-1': 'image-gallery-1-Bp5XjAnR.jpg',
    'gallery-2': 'image-gallery-2-lWO-GCpy.jpg',
    'gallery-3': 'image-gallery-3-2lIE5qMG.jpg'
  }
};

/**
 * Get the image path for a product using the hashed filenames
 * @param slug Product slug
 * @param type Image type (product, gallery-1, etc.)
 * @returns Path to the image
 */
export function getProductImagePath(
  slug: string,
  type: 'product' | 'gallery-1' | 'gallery-2' | 'gallery-3' = 'product',
  format: 'desktop' | 'mobile' | 'tablet' = 'desktop'
): string {
  // For product images, use the direct mapping to hashed filenames
  if (type === 'product') {
    return `/assets/${productImageMap[slug] || 'image-product-CFsmp4vM.jpg'}`;
  }
  
  // For gallery images, determine the category first
  let category = 'earphones';
  if (slug.includes('headphones')) {
    category = 'headphones';
  } else if (slug.includes('speaker')) {
    category = 'speakers';
  }
  
  // Return the appropriate gallery image based on category
  return `/assets/${galleryImageMap[category][type] || 'image-gallery-1-Qy07vxVZ.jpg'}`;
}

/**
 * Get path for category images
 */
export function getCategoryImagePath(category: string): string {
  const categoryImageMap: Record<string, string> = {
    'headphones': 'image-category-thumbnail-headphones-C26yv3-J.png',
    'earphones': 'image-category-thumbnail-earphones-Bb5M5Owd.png',
    'speakers': 'image-category-thumbnail-speakers-BjLeQxia.png'
  };
  
  return `/assets/${categoryImageMap[category] || 'image-category-thumbnail-earphones-Bb5M5Owd.png'}`;
}

/**
 * Get related product image path
 */
export function getRelatedProductImagePath(slug: string): string {
  // Just reuse the product image mapping
  return getProductImagePath(slug);
}
