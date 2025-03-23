import { ProductCheckoutItemProps } from '../../types/ProductTypes';

export default function CheckoutSummaryItem({
  product,
}: {
  product: ProductCheckoutItemProps;
}): React.ReactElement {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-4">
        <img src={product.image} width={64} height={64} alt={product.name} />
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
