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
  name: string;
  image: string;
  id: string | number;
  quantity: number;
  total: number;
};

export interface ProductOverviewProps {
  product: ProductProps;
}
