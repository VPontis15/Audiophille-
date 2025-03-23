import { Link } from 'react-router';
import CheckoutForm from '../components/Checkout/CheckoutForm';
import CheckoutSummary from '../components/Checkout/CheckoutSummary';

export default function CheckoutRoute(): React.ReactElement {
  return (
    <div className="bg-grey checkout-wrapper pb-35 ">
      <div className=" max-w-container mx-auto">
        <Link
          to=".."
          className="text-main opacity-50 capitalize inline-block mt-20 mb-9.5"
        >
          Go Back
        </Link>
        <section className="grid md:grid-cols-[66%_34%] gap-7.5 items-start">
          <CheckoutForm />
          <CheckoutSummary />
        </section>
      </div>
    </div>
  );
}
