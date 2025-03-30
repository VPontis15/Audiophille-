import Hero from '../components/Homepage/Hero';
import headphones from '../assets/image-category-thumbnail-headphones.png';
import earphones from '../assets/image-category-thumbnail-earphones.png';
import speakers from '../assets/image-category-thumbnail-speakers.png';
import Category from '../components/utils/Category';
import ProductsShowcase from '../components/Homepage/ProductsShowcase';
import bestGearDesktop from '../assets/desktop/image-best-gear.jpg';
import bestGearTablet from '../assets/tablet/image-best-gear.jpg';
import bestGearMobile from '../assets/mobile/image-best-gear.jpg';

export default function Homepage(): React.ReactElement {
  return (
    <main>
      <Hero />

      {/* Categories */}
      <section className="py-8 max-w-container mx-auto mb-12 flex mt-24 md:mt-8 flex-col  sm:flex-row gap-18 items-center   md:items-start md:gap-8">
        <Category img={headphones} title="Headphones" to="headphones" />
        <Category img={speakers} title="Earphones" to="earphones" />
        <Category img={earphones} title="Speakers" to="speakers" />
      </section>
      <ProductsShowcase />
      <section className="grid md:grid-cols-2 gap-16 lg:gap-33 max-w-container mx-auto mb-24 object-cover">
        <div className=" flex flex-col md:row-start-1 lg:row-start-1  h-full items-start justify-center gap-8  ">
          <h2 className="text-h2  uppercase font-bold leading-[1.2] max-w-[14ch]">
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
          loading="lazy"
          width={1920}
          height={588}
          src={bestGearDesktop}
          className=" rounded-xl  h-[300px] md:h-[588px]  object-cover w-full row-start-1"
          alt="ZX9 speaker"
        />
      </section>
    </main>
  );
}
