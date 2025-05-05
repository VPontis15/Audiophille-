import { useAppDispatch } from '../../types/hooks';
import { CartItem as CartItemProp } from '../../types/ProductTypes';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function CartItem({
  product,
  onRemove,
}: {
  product: CartItemProp;
  onRemove?: () => void;
}): React.ReactElement {
  const dispatch = useAppDispatch();
  const [isRemoving, setIsRemoving] = useState(false);

  // Handle image path correctly (works for both src/assets and public/images paths)
  const getImagePath = (imagePath: string) => {
    if (!imagePath) {
      return '/images/no-product-image.png'; // Default fallback
    }

    // If path already starts with /images, it's from the public folder
    if (imagePath.startsWith('/images/')) {
      return imagePath;
    }

    // If path contains src/assets, convert it to public path
    if (imagePath.includes('src/assets/')) {
      return imagePath.replace('src/assets/', '/images/');
    }

    return imagePath; // Return as-is if no conversion needed
  };

  const imageSrc =
    typeof product.image === 'string'
      ? getImagePath(product.image)
      : product.image?.desktop
      ? getImagePath(product.image.desktop)
      : '/images/no-product-image.png';

  // Handle decreasing quantity with animation when quantity becomes 0
  const handleDecreaseQuantity = () => {
    if (product.quantity === 1) {
      setIsRemoving(true);
      // Actual dispatch happens when animation completes in onExitComplete
    } else {
      dispatch({ type: 'cart/decreaseQuantity', payload: product.id });
    }
  };

  // Handle the exit completion - only now remove the item from the cart
  const handleExitComplete = () => {
    dispatch({ type: 'cart/decreaseQuantity', payload: product.id });
    if (onRemove) onRemove();
  };

  // Animation variants for smoother control
  const cartItemVariants = {
    visible: {
      opacity: 1,
      height: 'auto',
      scale: 1,
      marginBottom: '1rem',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    hidden: {
      opacity: 0,
      height: 0,
      scale: 0.8,
      marginBottom: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!isRemoving && (
        <motion.div
          className="flex gap-4 items-center justify-between overflow-hidden"
          initial="visible"
          animate="visible"
          exit="hidden"
          variants={cartItemVariants}
        >
          <div className="flex gap-8 items-center">
            <img
              width={48}
              height={48}
              src={imageSrc}
              alt={product.name}
              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md"
              onError={(e) => {
                e.currentTarget.src = '/images/no-product-image.png';
              }}
            />
            <div className="flex flex-col gap-1 justify-center">
              <h5 className="text-base max-w-[19ch] font-bold uppercase">
                {product.name}
              </h5>
              <span className="text-sm opacity-50 font-bold">
                ${product.price}
              </span>
            </div>
          </div>
          <form action="" method="post">
            <div className="flex gap-4 items-center">
              <div className="flex gap-2 bg-grey px-2">
                <button
                  onClick={handleDecreaseQuantity}
                  type="button"
                  className="px-2 sm:px-2.5 py-2 cursor-pointer"
                >
                  &minus;
                </button>
                <input type="hidden" name="" value={product.quantity} />
                <span className="font-bold inline-block px-2.5 py-2">
                  {product.quantity}
                </span>
                <button
                  onClick={() =>
                    dispatch({
                      type: 'cart/increaseQuantity',
                      payload: product.id,
                    })
                  }
                  type="button"
                  className="px-2 sm:px-2.5 py-2 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
