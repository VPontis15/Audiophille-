import { useParams } from 'react-router';
import CategoryHeader from '../components/utils/CategoryHeader';
import BreadCrumps from '../components/utils/BreadCrumps';
import bestGearDesktop from '../assets/desktop/image-best-gear.jpg';
import bestGearTablet from '../assets/tablet/image-best-gear.jpg';
import bestGearMobile from '../assets/mobile/image-best-gear.jpg';

import data from '../data/data.json';
import Product from '../components/utils/Product';
import { ProductProps } from '../types/ProductTypes';
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
      <section className=" mt-18 grid md:grid-cols-2 gap-16 lg:gap-33 max-w-container mx-auto mb-24 object-cover">
        <div className=" flex flex-col md:row-start-1 lg:row-start-1  h-full items-start justify-center gap-8  ">
          <h2 className="text-h2  uppercase font-bold leading-[1.2] md:max-w-[14ch]">
            Bringing you the <span className="text-accent">best</span> audio
            gear
          </h2>
          <p className="">
            Located at the heart of New York City, Audiophile is the premier
            store for high end headphones, earphones, speakers, and audio
            accessories. We have a large showroom and luxury demonstration rooms
            available for you to browse and experience a wide range of our
            products. Stop by our store to meet some of the fantastic people who
            make Audiophile the best place to buy your portable audio equipment.
          </p>
        </div>
        <img
          srcSet={`${bestGearMobile} 550w, ${bestGearTablet} 1024w, ${bestGearDesktop} 1280w`}
          sizes="(max-width: 550px) 100vw, (max-width: 960px) 100vw, 100vw"
          src={bestGearDesktop}
          className=" rounded-xl  h-[300px] md:h-[588px]  object-cover w-full row-start-1"
          alt="ZX9 speaker"
        />
      </section>
    </>
  );
}
