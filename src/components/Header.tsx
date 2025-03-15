import cart from '../assets/icon-cart.svg';
import React from 'react';
import Logo from './utils/Logo';
import Navigation from './utils/Navigation';

export default function Header(): React.ReactElement {
  return (
    <header className=" ">
      <div className="max-w-container border-b border-b-white/50  mx-auto flex justify-between py-8">
        <div>
          <Logo />{' '}
        </div>
        <Navigation />
        <div>
          <img src={cart} alt="" />
        </div>
      </div>
    </header>
  );
}
