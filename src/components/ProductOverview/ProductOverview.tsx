import productImg from '../../assets/desktop/product-yx1-earphones/image-product.jpg';
import { ProductOverviewProps } from '../../types/ProductTypes';
import AddToCartBtn from '../utils/AddToCartBtn';

export default function ProductOverview({
  product,
}: ProductOverviewProps): React.ReactElement {
  return (
    <div className="grid md:grid-cols-2 mt-20 gap-17 md:gap-24 lg:gap-31.5 product-wrapper">
      <img
        src={productImg}
        alt=""
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
