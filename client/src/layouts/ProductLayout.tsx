import BreadCrumps from '../components/utils/BreadCrumps';
import headphones from '../assets/image-category-thumbnail-headphones.png';
import Category from '../components/utils/Category';
import earphones from '../assets/image-category-thumbnail-earphones.png';
import speakers from '../assets/image-category-thumbnail-speakers.png';
import { ReactNode } from 'react';
import BestGearSection from '../components/components/BestGearSection';

export default function ProductLayout({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
    <div className="max-w-container mx-auto space-y-40">
      <BreadCrumps />
      {children}
      <section className="py-8 max-w-container mx-auto mb-12 flex flex-col sm:flex-row gap-18 items-center   md:items-start md:gap-8">
        <Category img={headphones} title="Headphones" to="headphones" />
        <Category img={earphones} title="Earphones" to="earphones" />
        <Category img={speakers} title="Speakers" to="speakers" />
      </section>
      <BestGearSection />
    </div>
  );
}
