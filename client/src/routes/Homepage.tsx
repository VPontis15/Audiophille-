import Hero from '../components/Homepage/Hero';
import headphones from '../assets/image-category-thumbnail-headphones.png';
import earphones from '../assets/image-category-thumbnail-earphones.png';
import speakers from '../assets/image-category-thumbnail-speakers.png';
import Category from '../components/utils/Category';
import ProductsShowcase from '../components/Homepage/ProductsShowcase';
import { useRef } from 'react';
import { useInView, motion } from 'framer-motion';
import BestGearSection from '../components/components/BestGearSection';

export default function Homepage(): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: false, // Trigger only once when the element comes into view
    amount: 0.1, // Trigger when 10% of the element is in the viewport
  });

  // Animation variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <main>
      <Hero />

      {/* Categories */}
      <motion.section
        ref={ref}
        className="py-8 max-w-container mx-auto mb-12 flex mt-24 md:mt-8 flex-col  sm:flex-row gap-18 items-center   md:items-start md:gap-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <motion.div variants={itemVariants}>
          <Category img={headphones} title="Headphones" to="headphones" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Category img={earphones} title="Earphones" to="earphones" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Category img={speakers} title="Speakers" to="speakers" />
        </motion.div>
      </motion.section>
      <ProductsShowcase />
      <BestGearSection />
    </main>
  );
}
