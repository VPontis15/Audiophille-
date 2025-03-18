import { CartItem as CartItemProp } from '../../types/ProductTypes';

export default function CartItem({
  product,
}: {
  product: CartItemProp;
}): React.ReactElement {
  return (
    <div className="flex gap-4 items-center justify-between ">
      {/* <img src={product.image} alt="" /> */}
      <div className="flex gap-8 items-center">
        <div className="w-16 h-16 bg-grey"></div>
        <div className="flex flex-col gap-1  justify-center">
          <h5 className="text-base max-w-[19ch] font-bold uppercase">
            {product.name}
          </h5>
          <span className="text-sm opacity-50 font-bold">${product.price}</span>
        </div>
      </div>
      <form action="" method="post">
        <div className="flex gap-4 items-center">
          <div className="flex gap-2 bg-grey px-2">
            <button type="button" className="px-2.5 py-2 cursor-pointer ">
              &minus;
            </button>
            <input type="hidden" name="" value={product.quantity} />
            <span className="font-bold inline-block  px-2.5 py-2">
              {product.quantity}
            </span>
            <button type="button" className="px-2.5 py-2 cursor-pointer">
              +
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
