/**
 * Utility function to resolve image paths from JSON data to the correct public folder path
 * This handles both legacy relative paths (../assets/) and absolute paths (/images/)
 *
 * @param imagePath - The image path from the JSON file
 * @returns The corrected image path for public folder usage
 */
export function resolveImagePath(imagePath: string): string {
  if (!imagePath) {
    return '/images/no-product-image.png'; // Default fallback image
  }

  // If path already starts with /, it's already using the public folder
  if (imagePath.startsWith('/')) {
    return imagePath;
  }

  // Handle relative paths from JSON data
  if (imagePath.includes('../assets/')) {
    // Convert ../assets/ paths to /images/ paths
    return imagePath.replace('../assets/', '/images/');
  }

  if (imagePath.includes('./assets/')) {
    // Convert ./assets/ paths to /images/ paths
    return imagePath.replace('./assets/', '/images/');
  }

  // If no transformation matched, return the original path
  return imagePath;
}
