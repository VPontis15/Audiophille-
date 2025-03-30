import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../types/hooks';
import { FaShoppingCart } from 'react-icons/fa';

export function CartHeader(): React.ReactElement {
  const cartItemsQuantity = useAppSelector((state) => state.cart.items.length);
  const dispatch = useAppDispatch();
  const emptyCart = () => {
    try {
      dispatch({ type: 'cart/emptyCart' });
      toast.success('Cart has been emptied', {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          color: '#101',
        },
        icon: <FaShoppingCart className="text-primary/30" />,
      });
    } catch (error) {
      toast.error(`Failed to empty cart.${error}`, {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  return (
    <>
      <div className="flex justify-between items-start">
        {cartItemsQuantity < 1 && (
          <button
            onClick={() => dispatch({ type: 'settings/closeCart' })}
            className="text-primary underline ml-auto opacity-50 cursor-pointer"
          >
            Close
          </button>
        )}
        {cartItemsQuantity > 0 && (
          <>
            <h6 className="text-h6 font-bold uppercase">
              Cart({cartItemsQuantity})
            </h6>
            <button
              onClick={() => emptyCart()}
              className="text-primary underline opacity-50 cursor-pointer"
            >
              Remove All
            </button>
          </>
        )}
      </div>
    </>
  );
}
