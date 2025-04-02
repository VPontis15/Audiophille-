import React from 'react';
import arrow from '../../assets/icon-arrow-right.svg';
import Button from '../../utils/Button';
interface CategoryProps {
  img: string;
  title: string;
  to: string;
}

export default function Category({
  img,
  title,
  to,
}: CategoryProps): React.ReactElement {
  return (
    <div className="rounded-xl bg-grey w-full max-w-[350px] sm:w-[350px] relative flex flex-col place-items-center  h-[200px] px-4 py-2">
      <img
        className="w-[120px] -mt-16 h-[160px] object-cover"
        src={img}
        width={120}
        height={160}
        alt=""
        loading="lazy"
      />
      <h6 className="text-h6 uppercase font-bold tracking-[1.26px]">{title}</h6>
      <Button
        to={`/products/${to}`}
        transparent
        className="uppercase text-text inline-flex items-center gap-2 "
      >
        <span className="text-small">Shop</span>
        <img className="w-[5px] h-[10px]" src={arrow} alt="" />
      </Button>
    </div>
  );
}
