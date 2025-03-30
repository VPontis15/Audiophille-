import { useAppSelector } from '../../types/hooks';
import CartFooter from './CartFooter';
import { CartHeader } from './CartHeader';
import CartItem from './CartItem';
import CartModal from './CartModal';
import { FaShoppingCart } from 'react-icons/fa';

export default function Cart(): React.ReactElement {
  const cartItems = useAppSelector((state) => state.cart.items);
  return (
    <CartModal>
      <CartHeader />
      <div className="mb-8 grid gap-4">
        {cartItems.length ? (
          cartItems.map((item) => <CartItem key={item.id} product={item} />)
        ) : (
          <div className="flex flex-col px-12 py-10 items-center justify-center gap-12 text-center">
            <h6 className="text-h6 font-bold uppercase">Your cart is empty</h6>
            <FaShoppingCart width={80} height={80} className="w-20 h-20" />
          </div>
        )}
      </div>
      <CartFooter />
    </CartModal>
  );
}
