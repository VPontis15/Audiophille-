import logo from '../../assets/logo.svg';
import Link from './Link';

interface LogoProps {
  [key: string]: unknown;
}

export default function Logo(props: LogoProps): React.ReactElement {
  return (
    <Link
      href="/"
      className="flex-1 flex items-center justify-center sm:justify-start"
    >
      <img {...props} src={logo} alt="audiophille logo" />
    </Link>
  );
}
