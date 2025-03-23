import { useAppSelector } from '../../types/hooks';
import CheckoutSummaryFooter from './CheckoutSummaryFooter';
import CheckoutSummaryItem from './CheckoutSummaryItem';

export default function CheckoutSummary(): React.ReactElement {
  const products = useAppSelector((state) => state.cart.items);
  return (
    <div className=" p-8 bg-white rounded-xl ">
      <h2 className="text-lg font-bold tracking-[1px] uppercase mb-7.5">
        Summary
      </h2>
      <div className="flex flex-col gap-4 mb-8">
        {products.map((product) => (
          <CheckoutSummaryItem key={product.name} product={product} />
        ))}
      </div>
      <CheckoutSummaryFooter />
    </div>
  );
}
