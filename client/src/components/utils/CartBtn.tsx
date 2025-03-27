import { useEffect, useRef } from 'react';
import cartImg from '../../assets/icon-cart.svg';
import { useAppDispatch, useAppSelector } from '../../types/hooks';

export default function CartBtn(): React.ReactElement {
  const cartQuantity = useAppSelector((state) => state.cart.items.length);
  const btnRef = useRef<HTMLButtonElement>(null);
  const isOpen = useAppSelector((state) => state.settings.isOpen);
  const dispatch = useAppDispatch();

  useEffect(() => {
    function handleClickOnOverlay(e: MouseEvent) {
      const clickedElement = e.target as HTMLElement;

      // Prevent closing when clicking the cart button itself
      if (btnRef.current && btnRef.current.contains(clickedElement)) {
        return;
      }

      if (
        isOpen &&
        clickedElement.closest('.cart-modal') === null &&
        clickedElement.closest('.overlay') !== null
      ) {
        dispatch({ type: 'settings/closeCart' });
      }
    }

    document.addEventListener('click', handleClickOnOverlay);

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('click', handleClickOnOverlay);
    };
  }, [isOpen, dispatch]);

  return (
    <div className="relative pr-2">
      <button
        ref={btnRef}
        onClick={(e) => {
          e.stopPropagation(); // Stop event from bubbling
          dispatch({ type: 'settings/openCart' });
        }}
        className="cursor-pointer grid place-items-center"
      >
        {cartQuantity > 0 && (
          <span data-quantity={`${cartQuantity}`} className="cart-btn"></span>
        )}
        <img src={cartImg} alt="" />
      </button>
    </div>
  );
}
