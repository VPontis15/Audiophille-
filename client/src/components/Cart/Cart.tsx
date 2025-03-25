import { useAppSelector } from '../../types/hooks';
import CartFooter from './CartFooter';
import { CartHeader } from './CartHeader';
import CartItem from './CartItem';
import CartModal from './CartModal';

export default function Cart(): React.ReactElement {
  const cartItems = useAppSelector((state) => state.cart.items);
  return (
    <CartModal>
      <CartHeader />
      <div className="mb-8 grid gap-4">
        {cartItems.map((item) => (
          <CartItem key={item.id} product={item} />
        ))}
      </div>
      <CartFooter />
    </CartModal>
  );
}
