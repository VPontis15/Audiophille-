import { useParams } from 'react-router';
import data from '../../data/data.json';
import { ProductProps } from '../../types/ProductTypes';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';

export default function ProductImages(): React.ReactElement {
  const { slug } = useParams<{ slug: string }>();
  const product = data.find((product) => product.slug === slug) as ProductProps;
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, {
    once: false,
    amount: 0.3,
  });

  // Fallback images in case product is not found
  const fallbackImages = {
    img1: '/images/no-product-image.png',
    img2: '/images/no-product-image.png',
    img3: '/images/no-product-image.png',
  };

  // Get gallery images from product data
  const getGalleryImages = () => {
    if (!product || !product.gallery) {
      return fallbackImages;
    }

    return {
      img1: product.gallery.first.desktop,
      img2: product.gallery.second.desktop,
      img3: product.gallery.third.desktop,
    };
  };

  const galleryImages = getGalleryImages();

  // Animation variants with stagger effect
  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        ease: [0.25, 0.1, 0.25, 1.0],
        staggerChildren: 0.2,
        delayChildren: 0.1,
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.1,
        staggerDirection: -1, // Reverse stagger order for exit
        when: 'afterChildren', // Wait for children to finish
        duration: 0.5,
      },
    },
  };

  const imageVariants = {
    hidden: {
      scale: 0.2,
      borderRadius: '100%',
      opacity: 0,
    },
    visible: {
      scale: 1,
      borderRadius: '6px',
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
    exit: {
      scale: 0.5,
      opacity: 0,
      y: 10,
      transition: {
        duration: 0.4, // Increase duration
        ease: [0.25, 0.1, 0.25, 1.0], // Use same easing for consistency
      },
    },
  };

  const whileHover = {
    scale: 1.05,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] },
  };

  return (
    <section ref={sectionRef} className="max-w-container mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={slug} // Add key to help AnimatePresence track component
          className="grid grid-cols-1 md:grid-cols-4 gap-5"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          exit="exit"
        >
          <div className="md:col-span-2">
            <div className="grid grid-rows-2 gap-5 h-full">
              <div className="rounded-md overflow-hidden cursor-pointer relative">
                <motion.img
                  variants={imageVariants}
                  whileHover={whileHover}
                  className="h-full w-full object-cover transform-gpu"
                  src={galleryImages.img1}
                  alt={`${product?.name || 'Product'} gallery image 1`}
                />
              </div>
              <div className="rounded-md overflow-hidden cursor-pointer relative">
                <motion.img
                  variants={imageVariants}
                  whileHover={whileHover}
                  className="h-full w-full object-cover transform-gpu"
                  src={galleryImages.img2}
                  alt={`${product?.name || 'Product'} gallery image 2`}
                />
              </div>
            </div>
          </div>
          <div className="md:col-span-2 rounded-md overflow-hidden cursor-pointer relative h-full">
            <motion.img
              variants={imageVariants}
              whileHover={whileHover}
              className="h-full w-full object-cover transform-gpu"
              src={galleryImages.img3}
              alt={`${product?.name || 'Product'} gallery image 3`}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
