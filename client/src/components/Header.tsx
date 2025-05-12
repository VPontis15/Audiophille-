import React from 'react';
import Logo from './utils/Logo';
import Navigation from './utils/Navigation';

import Cart from './Cart/Cart';
import { useAppSelector } from '../types/hooks';
import MobileButton from './utils/MobileButton';
import NavigationActions from './utils/NavigationActions';
export default function Header(): React.ReactElement {
  const isOpen = useAppSelector((state) => state.settings.isOpen);
  return (
    <header className="relative ">
      <div className="max-w-container border-b border-b-white/50  mx-auto flex justify-between py-8">
        <div className="flex  items-center gap-4">
          <MobileButton />
          <Logo />{' '}
        </div>
        <Navigation />
        <NavigationActions />

        {isOpen && <Cart />}
      </div>
    </header>
  );
}
