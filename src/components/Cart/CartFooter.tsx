import { useAppSelector } from '../../types/hooks';
import { ReactElement } from 'react';

export default function CartFooter(): ReactElement | null {
  const totalCartPrice = useAppSelector((state) =>
    state.cart.items.reduce((acc, item) => acc + item.total, 0)
  );
  return totalCartPrice > 0 ? (
    <div className="flex items-center justify-between">
      <h6 className=" text-base uppercase opacity-50">Total</h6>
      <h6 className="text-h6 font-bold ">${totalCartPrice}</h6>
    </div>
  ) : null;
}
