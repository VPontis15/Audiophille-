import { Link } from 'react-router';
import FormInput from '../components/utils/FormInput';
import FormRow from '../components/utils/FormRow';

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
        <div className="w-[736px] pb-12 px-12 bg-white rounded-md ">
          <h1 className="text-h3 uppercase font-bold mb-10 pt-13.5  ">
            Checkout
          </h1>
          <form method="post" action="">
            <h6 className="text-small mb-4 text-accent uppercase tracking-[1px]">
              Billing Details
            </h6>
            <FormRow>
              <FormInput
                label="Name"
                name="name"
                type="text"
                placeholder="Alexei Ward"
                value=""
                onChange={() => {}}
                required
              />
              <FormInput
                label="Email Adress"
                name="email"
                type="email"
                placeholder="alexei@mail.com"
                value=""
                onChange={() => {}}
                required
              />
            </FormRow>
            <FormRow>
              <FormInput
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="+1 202-555-0136"
                value=""
                onChange={() => {}}
                required
              />
            </FormRow>
            <h6 className="text-small mb-4 text-accent uppercase tracking-[1px]">
              Shipping Info
            </h6>
            <FormRow>
              <FormInput
                label="Address"
                name="address"
                type="text"
                placeholder="1137 Williams Avenue"
                value=""
                onChange={() => {}}
                required
                full
              />
            </FormRow>
            <FormRow>
              <FormInput
                label="Zip Code"
                name="zip"
                type="text"
                placeholder="10001"
                value=""
                onChange={() => {}}
                required
              />
              <FormInput
                label="City"
                name="city"
                type="text"
                placeholder="New York"
                value=""
                onChange={() => {}}
                required
              />
            </FormRow>
            <FormRow>
              <FormInput
                label="Country"
                name="country"
                type="text"
                placeholder="United States"
                value=""
                onChange={() => {}}
                required
              />
            </FormRow>
            <h6 className="text-small mb-4 text-accent uppercase tracking-[1px]">
              Payment Details
            </h6>
            <div className="grid grid-cols-2 ">
              <span className="text-small font-bold">Payment Method</span>
              <div className="flex flex-col gap-9 ">
                <FormInput
                  label="Stripe"
                  name="payment"
                  type="radio"
                  value=""
                  onChange={() => {}}
                  required
                />
                <FormInput
                  label="Viva Wallet"
                  name="payment"
                  type="radio"
                  value=""
                  onChange={() => {}}
                  required
                />
                <FormInput
                  label="Cash on Delivery"
                  name="payment"
                  type="radio"
                  value=""
                  onChange={() => {}}
                  required
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
