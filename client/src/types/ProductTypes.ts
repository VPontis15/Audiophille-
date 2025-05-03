export interface ImageVariant {
  url: string;
  alt?: string;
}

// Image type with all variants including new thumbnail
export interface ImageSet {
  desktop: ImageVariant;
  tablet: ImageVariant;
  mobile: ImageVariant;
  thumbnail: ImageVariant; // New thumbnail variant
}

// For gallery items
export interface GalleryItem {
  desktop: ImageVariant;
  tablet: ImageVariant;
  mobile: ImageVariant;
  thumbnail: ImageVariant; // New thumbnail variant
}

// Gallery type
export interface GalleryJSON {
  [index: number]: GalleryItem;
}

// For related products
export interface RelatedProductJSON {
  slug: string;
  name: string;
  image: ImageSet;
}

// For package contents
export interface PackageContentJSON {
  quantity: number;
  item: string;
}

// Updated AdminProductProps with thumbnail support

export interface RelatedProductProps {
  name: string;
  img?: string;
  slug: string;
  category?: string;
}

export interface ImageType {
  mobile: string;
  tablet: string;
  desktop: string;
}

export interface GalleryType {
  first: ImageType;
  second: ImageType;
  third: ImageType;
}

export interface IncludeType {
  quantity: number;
  item: string;
}

export interface RelatedProductType {
  slug: string;
  name: string;
  image: ImageType;
}

export interface ProductProps {
  id: number;
  slug: string;
  name: string;
  image: ImageType;
  category: string;
  categoryImage: ImageType;
  new: boolean;
  price: number;
  description: string;
  features?: string;
  includes?: IncludeType[];
  gallery?: GalleryType;
  others?: RelatedProductType[];
  img?: string; // Keeping this for backward compatibility
}

export type CartItem = {
  price: number;
  slug: string;
  name: string;
  image: string;
  id: string | number;
  quantity: number;
  total: number;
};

export interface ProductOverviewProps {
  product: ProductProps;
}

export interface ProductCheckoutItemProps {
  name: string;
  slug: string;
  quantity: number;
  price: number;
  image: string;
}
