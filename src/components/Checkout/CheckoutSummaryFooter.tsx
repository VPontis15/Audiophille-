import { useAppSelector } from '../../types/hooks';
import Button from '../utils/Button';
import CheckoutSummaryFooterRow from './CheckoutSummaryFooterRow';

export default function CheckoutSummaryFooter(): React.ReactElement {
  const { total, vat, shipping } = useAppSelector((state) => state.cart);

  const vatAmount = total * vat;
  return (
    <>
      <div className="flex flex-col gap-2">
        <CheckoutSummaryFooterRow heading="Total" value={`$${total}`} />
        <CheckoutSummaryFooterRow heading="Shipping" value={`$${shipping}`} />
        <CheckoutSummaryFooterRow
          heading="VAT(INCLUDED)"
          value={`$${vatAmount.toFixed(2)}`}
        />
      </div>
      <CheckoutSummaryFooterRow
        heading="Grand Total"
        value={`$${(total + shipping).toFixed(2)}`}
        grandTotal
      />
      <div className="mt-8 grid place-items-center w-full">
        <Button form="checkout-form" className="w-full text-sm" primary>
          Continue & Pay
        </Button>
      </div>
    </>
  );
}
