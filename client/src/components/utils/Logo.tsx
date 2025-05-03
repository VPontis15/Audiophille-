import logo from '../../assets/logo.svg';
import Link from './Link';

interface LogoProps {
  noLink?: boolean;
  [key: string]: unknown;
}

export default function Logo(props: LogoProps): React.ReactElement {
  const { noLink, ...rest } = props;

  // If noLink is true, just render the image without a Link wrapper
  if (noLink) {
    return <img {...rest} src={logo} alt="audiophille logo" />;
  }

  // Otherwise, wrap in a Link as before
  return (
    <Link
      href="/"
      className="flex-1 flex items-center justify-center sm:justify-start"
    >
      <img {...rest} src={logo} alt="audiophille logo" />
    </Link>
  );
}
