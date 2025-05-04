import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { FaCartArrowDown } from 'react-icons/fa6';

import Button from '../../utils/Button';
import { CartItem, ProductOverviewProps } from '../../../types/ProductTypes';
import { useAppDispatch } from '../../../types/hooks';

export default function AddToCartBtn({
  product,
}: ProductOverviewProps): React.ReactElement {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState<number>(1);
  const handleIncreaseQuantity = () =>
    setQuantity((quantity: number) => quantity + 1);
  const handleDecreaseQuantity = () => {
    if (quantity <= 1) return;
    setQuantity((quantity: number) => (quantity = quantity - 1));
  };

  const handleAddToCart = (e: FormEvent) => {
    e.preventDefault();
    try {
      const cartItem = {
        price: product.price,
        name: product.name,
        image: product.image.desktop,
        slug: product.slug,
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
      dispatch({ type: 'cart/addToCart', payload: cartItem });

      toast.success(`${cartItem.name} has been added to the cart`, {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          color: '#101',
          fontSize: '16px',
          padding: '20px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
        },
        icon: (
          <FaCartArrowDown
            width={24}
            height={24}
            className="text-[#07bc0c]  w-6 h-6"
          />
        ),
      });
    } catch (error) {
      toast.error(`There was an error adding the item to the cart. ${error}`, {
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
      <form action="" method="post" onSubmit={handleAddToCart}>
        <div className="flex gap-4 items-center">
          <div className="bg-grey flex items-center">
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
          </div>
          <Button className="uppercase" primary>
            Add to cart
          </Button>
        </div>
      </form>
    </>
  );
}
