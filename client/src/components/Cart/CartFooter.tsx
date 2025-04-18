import { useAppDispatch, useAppSelector } from '../../types/hooks';
import { ReactElement } from 'react';
import Button from '../utils/Button';

export default function CartFooter(): ReactElement | null {
  const totalCartPrice = useAppSelector((state) => state.cart.total);
  const dispatch = useAppDispatch();
  return totalCartPrice > 0 ? (
    <>
      <div className="flex items-center justify-between">
        <h6 className=" text-base uppercase opacity-50">Total</h6>
        <h6 className="text-h6 font-bold ">${totalCartPrice}</h6>
      </div>
      <Button
        onClick={() => dispatch({ type: 'settings/closeCart' })}
        className="text-center"
        to="/checkout"
        primary
      >
        Checkout
      </Button>
    </>
  ) : null;
}
