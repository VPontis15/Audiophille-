import { useParams } from 'react-router';
import data from '../data/data.json';

import ProductLayout from '../ProductLayout';
import ProductOverview from '../components/ProductOverview/ProductOverview';
import { ProductProps } from '../types/ProductTypes';
import Features from '../components/ProductOverview/Features';
import ProductImages from '../components/ProductOverview/ProductImages';
import RelatedProducts from '../components/ProductOverview/RelatedProducts';

export default function ProductRoute(): React.ReactElement {
  const { slug } = useParams<{ slug: string }>();
  const product = data.find((product) => product.slug === slug) as ProductProps;
  return (
    <ProductLayout>
      <ProductOverview product={product} />
      <Features product={product} />
      <ProductImages />
      <RelatedProducts product={product} />
    </ProductLayout>
  );
}
