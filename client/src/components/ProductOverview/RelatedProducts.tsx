import { ProductProps, RelatedProductProps } from '../../types/ProductTypes';

import productImg from '../../assets/desktop/product-yx1-earphones/image-product.jpg';
import Button from '../utils/Button';
export default function RelatedProducts({
  product,
}: {
  product: ProductProps;
}): React.ReactElement {
  return (
    <section className="max-w-container mx-auto font-bold">
      <h3 className="text-h3 text-center uppercase mb-16">You may also like</h3>
      <div className="grid sm:grid-cols-3 gap-8 mb-20 place-items-center text-center">
        {product?.others?.map((relatedProgram: RelatedProductProps) => (
          <div key={relatedProgram.slug} className="flex flex-col gap-4">
            <img
              src={productImg}
              alt=""
              className="h-[320px] w-full rounded-md object-cover"
            />
            <h5 className="text-h5">{relatedProgram.name}</h5>
            <Button
              to={`/products/${product.category}/${relatedProgram.slug}`}
              primary
              className="uppercase self-center !text-xs"
            >
              See product
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
