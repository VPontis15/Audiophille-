import Hero from '../components/Homepage/Hero';
import headphones from '../assets/image-category-thumbnail-headphones.png';
import earphones from '../assets/image-category-thumbnail-earphones.png';
import speakers from '../assets/image-category-thumbnail-speakers.png';
import Category from '../components/utils/Category';

export default function Homepage() {
  return (
    <main>
      <Hero />
      {/* Categories */}
      <section className="py-8 max-w-container mx-auto flex flex-col md:flex-row gap-18 items-center md:items-start md:gap-8">
        <Category img={headphones} title="Headphones" to="/headphones" />
        <Category img={speakers} title="Earphones" to="/earphones" />
        <Category img={earphones} title="Speakers" to="/speakers" />
      </section>
    </main>
  );
}
