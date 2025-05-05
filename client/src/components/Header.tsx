import React from 'react';
import Logo from './utils/Logo';
import Navigation from './utils/Navigation';
import CartBtn from './utils/CartBtn';
import Link from './utils/Link';

import Cart from './Cart/Cart';
import { useAppSelector } from '../types/hooks';
import MobileButton from './utils/MobileButton';
import { SiAdminer } from 'react-icons/si';
export default function Header(): React.ReactElement {
  const isOpen = useAppSelector((state) => state.settings.isOpen);
  return (
    <header className="relative ">
      <div className="max-w-container border-b border-b-white/50  mx-auto flex justify-between py-8">
        <div className="flex flex-1 items-center gap-4">
          <MobileButton />
          <Logo />{' '}
        </div>
        <Navigation />
        <div className="flex items-center gap-6">
          <CartBtn />
          <Link href={'/admin/dashboard'}>
            <SiAdminer className="text-white w-7.5 h-7.5 " />
          </Link>
          <Link className="text-white text-sm" href="/signup">
            Login/Singup
          </Link>
        </div>
        {isOpen && <Cart />}
      </div>
    </header>
  );
}
