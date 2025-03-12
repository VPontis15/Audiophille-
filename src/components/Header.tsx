import logo from '../assets/logo.svg';
import cart from '../assets/icon-cart.svg';
import React from 'react';
import Link from './utils/Link';

export default function Header(): React.ReactElement {
  return (
    <header className="   ">
      <div className="max-w-container border-b border-b-white/50  mx-auto flex justify-between py-8">
        <div>
          <img src={logo} alt="audiophille logo" />
        </div>
        <ul className="flex items-center flex-1 justify-center gap-8">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/headphones">Headphones</Link>
          </li>
          <li>
            <Link href="/contact">Speakers</Link>
          </li>
          <li>
            <Link href="/contact">Earphones</Link>
          </li>
        </ul>
        <div>
          <img src={cart} alt="" />
        </div>
      </div>
    </header>
  );
}
