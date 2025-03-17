import Button from '../utils/Button';
import productImg from '../../assets/desktop/product-yx1-earphones/image-product.jpg';
import { ProductOverviewProps } from '../../types/ProductTypes';

export default function ProductOverview({
  product,
}: ProductOverviewProps): React.ReactElement {
  return (
    <div className="grid grid-cols-2 mt-20 gap-31.5">
      <img src={productImg} alt="" className="h-[560px]" />
      <div className="flex flex-col justify-center">
        {product.new && (
          <span className="text-hover  inline-block mb-4 text-sm font-bold uppercase tracking-[10px]">
            New Product
          </span>
        )}
        <h2 className="text-h2 tracking-[1.41px] font-bold mb-8 leading-[1.1]">
          {product?.name}
        </h2>
        <p className="opacity-50 mb-8">{product.description}</p>
        <span className="text-h6 inline-block font-bold mb-12">
          ${product.price}
        </span>
        <div className="flex gap-4 items-center">
          <div className="bg-grey">
            <button className="p-4">&minus;</button>
            <span className="font-bold inline-block p-4">1</span>
            <button className="p-4">+</button>
          </div>
          <Button className="uppercase" primary>
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
}
