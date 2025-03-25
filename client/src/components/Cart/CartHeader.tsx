import { useAppDispatch, useAppSelector } from '../../types/hooks';

export function CartHeader(): React.ReactElement {
  const cartItemsQuantity = useAppSelector((state) => state.cart.items.length);
  const dispatch = useAppDispatch();
  return (
    <div className="flex justify-between items-start">
      <h6 className="text-h6 font-bold uppercase">Cart({cartItemsQuantity})</h6>
      {cartItemsQuantity > 0 && (
        <button
          onClick={() => dispatch({ type: 'cart/emptyCart' })}
          className="text-primary underline opacity-50 cursor-pointer"
        >
          Remove All
        </button>
      )}
    </div>
  );
}
