import { useParams } from 'react-router';
import data from '../../data/data.json';
import { ProductProps } from '../../types/ProductTypes';

// Import specific gallery images for headphones
import headphoneGallery1 from '../../assets/desktop/product-xx99-mark-two-headphones/image-gallery-1.jpg';
import headphoneGallery2 from '../../assets/desktop/product-xx99-mark-two-headphones/image-gallery-2.jpg';
import headphoneGallery3 from '../../assets/desktop/product-xx99-mark-two-headphones/image-gallery-3.jpg';

// Import specific gallery images for earphones
import earphoneGallery1 from '../../assets/desktop/product-yx1-earphones/image-gallery-1.jpg';
import earphoneGallery2 from '../../assets/desktop/product-yx1-earphones/image-gallery-2.jpg';
import earphoneGallery3 from '../../assets/desktop/product-yx1-earphones/image-gallery-3.jpg';

// Import specific gallery images for speakers
import speakerGallery1 from '../../assets/desktop/product-zx9-speaker/image-gallery-1.jpg';
import speakerGallery2 from '../../assets/desktop/product-zx9-speaker/image-gallery-2.jpg';
import speakerGallery3 from '../../assets/desktop/product-zx9-speaker/image-gallery-3.jpg';

export default function ProductImages(): React.ReactElement {
  const { slug } = useParams<{ slug: string }>();
  const product = data.find((product) => product.slug === slug) as ProductProps;

  // Function to get the appropriate gallery images based on product category
  const getGalleryImages = () => {
    if (!product || !product.category) {
      return {
        img1: earphoneGallery1,
        img2: earphoneGallery2,
        img3: earphoneGallery3,
      };
    }

    switch (product.category.toLowerCase()) {
      case 'headphones':
        return {
          img1: headphoneGallery1,
          img2: headphoneGallery2,
          img3: headphoneGallery3,
        };
      case 'speakers':
        return {
          img1: speakerGallery1,
          img2: speakerGallery2,
          img3: speakerGallery3,
        };
      case 'earphones':
        return {
          img1: earphoneGallery1,
          img2: earphoneGallery2,
          img3: earphoneGallery3,
        };
      default:
        return {
          img1: earphoneGallery1,
          img2: earphoneGallery2,
          img3: earphoneGallery3,
        };
    }
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
