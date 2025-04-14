import { useAppSelector } from '../../types/hooks';
import CheckoutSummaryItem from '../Checkout/CheckoutSummaryItem';
import Button from './Button';
import confirmationLogo from '../../assets/icon-order-confirmation.svg';

export function Completed(): React.ReactElement {
  const { items, total } = useAppSelector((state) => state.cart);

  return (
    <div className="p-12 ">
      <img
        className="mb-8"
        width={64}
        height={64}
        src={confirmationLogo}
        alt=""
      />
      <h1 className="text-h3 leading-[1.2] font-bold mb-6 uppercase ">
        Thank you for your order
      </h1>
      <p className="  text-text opacity-50">
        You will receive an email confirmation shortly..
      </p>
      <div className="grid  md:grid-cols-[55%_45%]   items-center mt-8 ">
        <div className="bg-grey rounded-t-lg md:rounded-l-lg flex h-full w-full flex-col gap-2 pl-6 pt-10 pb-6 pr-6  ">
          <CheckoutSummaryItem imgSize={50} product={items[0]} />
          {items.slice(1).length > 0 && (
            <>
              <div className="w-full h-0.5 bg-black opacity-[.08]"></div>
              <span className=" text-center">
                and {items.slice(1).length} other{' '}
                {items.slice(1).length > 1 ? 'items' : 'item'}
              </span>
            </>
          )}
        </div>
        <div className="bg-black rounded-b-lg md:rounded-r-lg text-white flex flex-col gap-2 h-full w-full pl-6 pt-4 md:pt-10 pb-6 pr-18.5 ">
          <h2 className="uppercase text-white/50  font-bold">Grand Total</h2>
          <span className="text-lg  font-bold ">${total}</span>
        </div>
      </div>
      <Button
        className="uppercase mt-11.5 inline-block w-full text-center"
        primary
        to="/"
      >
        Back to home
      </Button>
    </div>
  );
}
