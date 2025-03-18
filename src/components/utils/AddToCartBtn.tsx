import { FormEvent, useState } from 'react';
import Button from './Button';
import { ProductOverviewProps } from '../../types/ProductTypes';

export default function AddToCartBtn({
  product,
}: ProductOverviewProps): React.ReactElement {
  const [quantity, setQuantity] = useState<number>(1);
  const handleIncreaseQuantity = () =>
    setQuantity((quantity: number) => quantity + 1);
  const handleDecreaseQuantity = () => {
    if (quantity <= 1) return;
    setQuantity((quantity: number) => (quantity = quantity - 1));
  };

  const handleAddToCart = (e: FormEvent) => {
    type CartItem = {
      price: number;
      name: string;
      image: string;
      id: string | number;
      quantity: number;
      total: number;
    };

    e.preventDefault();
    const cartItem = {
      price: product.price,
      name: product.name,
      image: product.image.mobile,
      id: product.id,
      quantity,
      total: product.price * quantity,
    };
    const cart = localStorage.getItem('cart');
    if (!cart) {
      localStorage.setItem('cart', JSON.stringify([cartItem]));
    } else {
      const cartItems = JSON.parse(cart);
      const isInCart = cartItems.find(
        (item: CartItem) => item.id === product.id
      );
      console.log(cartItems);

      if (!isInCart) cartItems.push(cartItem);
      else {
        cartItems.map((item: CartItem) => {
          if (item.id === product.id) {
            item.quantity += quantity;
            item.total = item.price * item.quantity;
          }
        });
      }
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
    setQuantity(1);
    // Add your cart logic here using cartItem
  };

  return (
    <div className="flex gap-4 items-center">
      <div className="bg-grey">
        <form action="" method="post" onSubmit={handleAddToCart}>
          <button
            type="button"
            onClick={handleDecreaseQuantity}
            className="p-4 cursor-pointer "
          >
            &minus;
          </button>
          <input type="hidden" name="" value={quantity} />
          <span className="font-bold inline-block p-4">{quantity}</span>
          <button
            type="button"
            onClick={handleIncreaseQuantity}
            className="p-4 cursor-pointer"
          >
            +
          </button>
          <Button className="uppercase" primary>
            Add to cart
          </Button>
        </form>
      </div>
    </div>
  );
}
