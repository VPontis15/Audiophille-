// Default fallback images for each category
import headphoneImg from '../../assets/desktop/product-xx99-mark-two-headphones/image-product.jpg';
import earphoneImg from '../../assets/desktop/product-yx1-earphones/image-product.jpg';
import speakerImg from '../../assets/desktop/product-zx9-speaker/image-product.jpg';
import { ProductOverviewProps } from '../../types/ProductTypes';
import AddToCartBtn from '../components/ui/AddToCartBtn';

export default function ProductOverview({
  product,
}: ProductOverviewProps): React.ReactElement {
  // Function to get the right image based on product data
  const getProductImage = () => {
    if (!product) return earphoneImg; // Default fallback

    // If product has image data in the expected format
    if (product.image) {
      // Check for different image formats
      if (typeof product.image === 'object') {
        if (
          'desktop' in product.image &&
          typeof product.image.desktop === 'string'
        ) {
          return product.image.desktop;
        }
      }
    }

    // Fallback to category-based images if no specific image is available
    switch (product.category?.toLowerCase()) {
      case 'headphones':
        return headphoneImg;
      case 'speakers':
        return speakerImg;
      case 'earphones':
        return earphoneImg;
      default:
        return earphoneImg;
    }
  };

  return (
    <div className="grid md:grid-cols-2 mt-20 gap-17 md:gap-24 lg:gap-31.5 product-wrapper">
      <img
        src={getProductImage()}
        alt={product?.name || 'Product image'}
        height={560}
        width={540}
        className="md:h-[560px] w-full rounded-md md:max-w-[540px] object-cover"
      />
      <div className="flex flex-col justify-center">
        {product.new && (
          <span className="text-hover  inline-block mb-4 text-sm font-bold uppercase tracking-[10px]">
            New Product
          </span>
        )}
        <h2 className="text-h2 tracking-[1.41px] font-bold mb-8 leading-[1.1]">
          {product?.name}
        </h2>
        <p className="opacity-50 mb-8 max-sm:max-w-[55ch] xs:max-w-full">
          {product.description}
        </p>
        <span className="text-h6 inline-block font-bold mb-12">
          ${product.price}
        </span>
        <AddToCartBtn product={product} />
      </div>
    </div>
  );
}
