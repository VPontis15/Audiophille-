import { useParams } from 'react-router';
import CategoryHeader from '../components/utils/CategoryHeader';
import BreadCrumps from '../components/utils/BreadCrumps';
import bestGearDesktop from '../assets/desktop/image-best-gear.jpg';
import bestGearTablet from '../assets/tablet/image-best-gear.jpg';
import bestGearMobile from '../assets/mobile/image-best-gear.jpg';

import data from '../data/data.json';
import Product from '../components/utils/Product';
import { ProductProps } from '../types/ProductTypes';
import BestGearSection from '../components/components/BestGearSection';
export default function CategoryRoute(): React.ReactElement {
  const { category } = useParams<{ category: string }>();
  const products = data.filter(
    (product: ProductProps) => product.category === category
  );

  return (
    <>
      <CategoryHeader>{category}</CategoryHeader>
      <BreadCrumps />
      <section className="max-w-container mt-30 mx-auto grid gap-40 mb-40 ">
        {products && products.length > 0 ? (
          products.map((product: ProductProps, index: number) => (
            <Product
              key={product.slug}
              reversed={index % 2 !== 0}
              product={product}
            />
          ))
        ) : (
          <p>No products found in this category.</p>
        )}
      </section>
      <BestGearSection />
    </>
  );
}
