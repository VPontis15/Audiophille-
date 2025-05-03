import { useParams } from 'react-router';
import data from '../data/data.json';

import ProductLayout from '../layouts/ProductLayout';
import ProductOverview from '../components/ProductOverview/ProductOverview';
import { ProductProps } from '../types/ProductTypes';
import Features from '../components/ProductOverview/Features';
import ProductImages from '../components/ProductOverview/ProductImages';
import RelatedProducts from '../components/ProductOverview/RelatedProducts';

export default function ProductRoute(): React.ReactElement {
  const { slug } = useParams<{ slug: string }>();
  const product = data.find((product) => product.slug === slug) as ProductProps;

  // If product has image data in the expected format, use it
  // Otherwise, construct an image path based on the slug
  if (product) {
    const productImagePath = `/src/assets/desktop/product-${slug}/image-product.jpg`;
    product.image = {
      desktop: productImagePath,
      mobile: `/src/assets/mobile/product-${slug}/image-product.jpg`,
      tablet: `/src/assets/tablet/product-${slug}/image-product.jpg`,
    };
  }
  return (
    <ProductLayout>
      <ProductOverview product={product} />
      <Features product={product} />
      <ProductImages />
      <RelatedProducts product={product} />
    </ProductLayout>
  );
}
