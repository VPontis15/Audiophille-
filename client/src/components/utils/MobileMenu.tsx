import Link from './Link';

export default function MobileMenu({
  isOpen,
  closeMenu,
}: {
  isOpen: boolean;
  closeMenu: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}): React.ReactElement {
  return (
    <div
      className={`absolute top-0   transition-[left] duration-500 ${
        isOpen ? 'left-0 opened ' : '-left-2/5 '
      } bg-text text-white w-40 h-40 z-99`}
    >
      <nav className="min-h-screen   relative  grid">
        {isOpen && (
          <div
            onClick={(e) => closeMenu(e)}
            className="fixed inset-0 bg-text/50 -z-10"
          ></div>
        )}
        <ul className="h-full grid justify-center items-center text-center bg-text z-10">
          <li>
            <Link className="text-white text-sm" href="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="text-white text-sm" href="/products/headphones">
              Headphones
            </Link>
          </li>
          <li>
            <Link className="text-white text-sm" href="/products/speakers">
              Speakers
            </Link>
          </li>
          <li>
            <Link className="text-white text-sm" href="/products/earphones">
              Earphones
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
