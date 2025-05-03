import Link from './Link';

export default function MobileMenu({
  isOpen,
  closeMenu,
}: {
  isOpen: boolean;
  closeMenu: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}): React.ReactElement {
  // Handler for when a nav link is clicked
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    // Create a synthetic event that closeMenu can use
    const syntheticEvent = {
      ...e,
      target: e.currentTarget.parentElement as HTMLDivElement,
    } as unknown as React.MouseEvent<HTMLDivElement, MouseEvent>;

    closeMenu(syntheticEvent);
  };

  return (
    <div
      className={`absolute top-0   transition-[left] duration-500 ${
        isOpen ? 'left-0 opened ' : '-left-[100%] '
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
            <Link
              className="text-white text-sm"
              href="/"
              onClick={handleLinkClick}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              className="text-white text-sm"
              href="/products/headphones"
              onClick={handleLinkClick}
            >
              Headphones
            </Link>
          </li>
          <li>
            <Link
              className="text-white text-sm"
              href="/products/speakers"
              onClick={handleLinkClick}
            >
              Speakers
            </Link>
          </li>
          <li>
            <Link
              className="text-white text-sm"
              href="/products/earphones"
              onClick={handleLinkClick}
            >
              Earphones
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
