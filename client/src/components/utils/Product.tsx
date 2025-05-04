import React from 'react';
import classNames from 'classnames';
import Button from './Button';
import { ProductProps } from '../../types/ProductTypes';

export default function Product({
  reversed = false,
  product,
}: {
  reversed?: boolean;
  product: ProductProps;
}): React.ReactElement {
  const className = classNames(
    'flex flex-col   items-center md:items-center md:flex-row',
    ' gap-13 md:gap-31',
    {
      'md:flex-row-reverse': reversed,
    }
  );

  // Use the desktop image path from the product data
  const productImage =
    product.categoryImage?.desktop || '/images/no-product-image.png';

  return (
    <article className={className}>
      <div>
        <img
          className="lg:w-[540px] object-cover rounded-sm"
          src={productImage}
          alt={product.name}
        />
      </div>
      <div className="flex flex-col justify-center items-center  md:items-start">
        {product.new && (
          <span className="text-hover  inline-block mb-4 text-sm font-bold uppercase tracking-[10px]">
            New Product
          </span>
        )}
        <h3 className="text-h2 text-center md:text-left mb-8 font-bold max-w-[17ch] leading-[1.2]">
          {product.name}
        </h3>
        <p className="mb-10 text-center opacity-50 md:text-left max-w-[46ch]">
          {product.description}
        </p>
        <Button primary to={`/products/${product.category}/${product.slug}`}>
          See Product
        </Button>
      </div>
    </article>
  );
}
