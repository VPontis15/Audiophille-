import React from 'react';
import Logo from './utils/Logo';
import Navigation from './utils/Navigation';
import CartBtn from './utils/CartBtn';

import Cart from './Cart/Cart';
import { useAppSelector } from '../types/hooks';

export default function Header(): React.ReactElement {
  const isOpen = useAppSelector((state) => state.settings.isOpen);
  return (
    <header className="relative ">
      <div className="max-w-container border-b border-b-white/50  mx-auto flex justify-between py-8">
        <div>
          <Logo />{' '}
        </div>
        <Navigation />
        <CartBtn />
        {isOpen && <Cart />}
      </div>
    </header>
  );
}
