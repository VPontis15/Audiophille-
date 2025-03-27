import logo from '../../assets/logo.svg';
import Link from './Link';

export default function Logo(): React.ReactElement {
  return (
    <Link
      href="/"
      className="flex-1 flex items-center justify-center sm:justify-start"
    >
      <img src={logo} alt="audiophille logo" />
    </Link>
  );
}
