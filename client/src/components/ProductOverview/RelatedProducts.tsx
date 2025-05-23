import { ProductProps, RelatedProductProps } from '../../types/ProductTypes';
import { motion } from 'framer-motion';
import Button from '../utils/Button';
const whileHover = {
  scale: 1.05,
  transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] },
};

export default function RelatedProducts({
  product,
}: {
  product: ProductProps;
}): React.ReactElement {
  return (
    <section className="max-w-container mx-auto font-bold">
      <h3 className="text-h3 text-center uppercase mb-16">You may also like</h3>
      <div className="grid sm:grid-cols-3 gap-8 mb-20 place-items-center text-center">
        {product?.others?.map((relatedProduct: RelatedProductProps) => {
          // Use the image path from the JSON data, or fallback to a default image

          return (
            <div key={relatedProduct.slug} className="flex flex-col gap-4">
              <div className="overflow-hidden">
                <motion.img
                  whileHover={whileHover}
                  src={relatedProduct.image.desktop}
                  alt={relatedProduct.name}
                  className="h-[320px] w-full rounded-md object-cover"
                />
              </div>
              <h5 className="text-h5">{relatedProduct.name}</h5>
              <Button
                to={`/products/${product.category}/${relatedProduct.slug}`}
                primary
                className="uppercase self-center !text-xs"
              >
                See product
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
