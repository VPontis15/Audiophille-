import { useParams } from 'react-router';
import data from '../../data/data.json';
import { ProductProps } from '../../types/ProductTypes';

export default function ProductImages(): React.ReactElement {
  const { slug } = useParams<{ slug: string }>();
  const product = data.find((product) => product.slug === slug) as ProductProps;

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

  return (
    <section className="max-w-container mx-auto">
      <div className="images-grid grid justify-center">
        <div className="space-y-7.5 grid gap-4 h-full">
          <img
            className="img-1 rounded-md h-full object-cover"
            src={galleryImages.img1}
            alt={`${product?.name || 'Product'} gallery image 1`}
          />
          <img
            className="img-2 rounded-md h-full object-cover"
            src={galleryImages.img2}
            alt={`${product?.name || 'Product'} gallery image 2`}
          />
        </div>
        <img
          className="img-3 rounded-md object-cover"
          src={galleryImages.img3}
          alt={`${product?.name || 'Product'} gallery image 3`}
        />
      </div>
    </section>
  );
}
