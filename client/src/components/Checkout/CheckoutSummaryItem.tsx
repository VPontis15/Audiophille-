import { ProductCheckoutItemProps } from '../../types/ProductTypes';

export default function CheckoutSummaryItem({
  product,
  imgSize,
}: {
  product: ProductCheckoutItemProps;
  imgSize: number;
}): React.ReactElement {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-4">
        <img
          src={product.image}
          width={imgSize}
          height={imgSize}
          alt={product.name}
          className="object-cover rounded-md"
          onError={(e) => {
            e.currentTarget.src = '/images/no-product-image.png';
          }}
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
