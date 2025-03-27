import { useState } from 'react';
import { createPortal } from 'react-dom';
import MobileMenu from './MobileMenu';

export default function MobileButton(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = (e: React.MouseEvent) => {
    const clickedElement = e.target as HTMLElement;
    if (!clickedElement.closest('.mobile-menu')) setIsOpen(false);
  };
  return (
    <>
      <div
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        className=" grid gap-1 md:hidden   relative"
      >
        <div className="w-6 h-1   bg-white" />
        <div className="w-6  h-1 bg-white" />
        <div className="w-6 h-1     bg-white" />
      </div>

      {createPortal(
        <MobileMenu isOpen={isOpen} closeMenu={closeMenu} />,
        document.body
      )}
    </>
  );
}
