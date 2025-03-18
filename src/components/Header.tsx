import React, { useState } from 'react';
import Logo from './utils/Logo';
import Navigation from './utils/Navigation';
import CartBtn from './utils/CartBtn';

import Cart from './Cart/Cart';

export default function Header(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  function isOpenHandler() {
    setIsOpen(true);
  }
  return (
    <header className="relative ">
      <div className="max-w-container border-b border-b-white/50  mx-auto flex justify-between py-8">
        <div>
          <Logo />{' '}
        </div>
        <Navigation />
        <CartBtn
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onIsOpenHandler={isOpenHandler}
        />
        {isOpen && <Cart />}
      </div>
    </header>
  );
}
