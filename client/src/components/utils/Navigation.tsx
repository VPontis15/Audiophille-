import Link from './Link';

export default function Navigation(): React.ReactElement {
  return (
    <nav className="hidden md:flex items-center flex-1 justify-center gap-8 ">
      <ul className="hidden md:flex items-center flex-1 justify-center gap-8 ">
        <li>
          <Link className="text-white" href="/">
            Home
          </Link>
        </li>
        <li>
          <Link className="text-white" href="/products/headphones">
            Headphones
          </Link>
        </li>
        <li>
          <Link className="text-white" href="/products/speakers">
            Speakers
          </Link>
        </li>
        <li>
          <Link className="text-white" href="/products/earphones">
            Earphones
          </Link>
        </li>
      </ul>
    </nav>
  );
}
