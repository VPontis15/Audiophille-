import { ProductCheckoutItemProps } from '../../types/ProductTypes';

export default function CheckoutSummaryItem({
  product,
  imgSize,
}: {
  product: ProductCheckoutItemProps;
  imgSize: number;
}): React.ReactElement {
  const productImage = `/src/assets/desktop/product-${product.slug}/image-product.jpg`;

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-4">
        <img
          src={productImage}
          width={imgSize}
          height={imgSize}
          alt={product.name}
          className="object-cover rounded-md"
        />
        <div className="flex flex-col gap-2">
          <h6 className="text-base font-bold">{product.name}</h6>
          <span className="text-sm text-text font-bold opacity-50">
            ${product.price}
          </span>
        </div>
      </div>
      <span className="text-text font-bold opacity-50">
        x{product.quantity}
      </span>
    </div>
  );
}
