import headphones from '../assets/image-category-thumbnail-headphones.png';
import earphones from '../assets/image-category-thumbnail-earphones.png';
import speakers from '../assets/image-category-thumbnail-speakers.png';
import Category from '../components/utils/Category';
import CategoryHeader from '../components/utils/CategoryHeader';

export default function Products(): React.ReactElement {
  return (
    <>
      <CategoryHeader>Products</CategoryHeader>
      <section className="py-8 max-w-container mx-auto mb-12 mt-36 flex flex-col sm:flex-row gap-18 items-center   md:items-start md:gap-8">
        <Category img={headphones} title="Headphones" to="headphones" />
        <Category img={speakers} title="Earphones" to="earphones" />
        <Category img={earphones} title="Speakers" to="speakers" />
      </section>
    </>
  );
}
