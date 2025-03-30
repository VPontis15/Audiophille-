import { Link } from 'react-router';
import { NavigationLinkProps } from '../../../types/Dashboard/types';

export default function NavigationLink({
  to,

  children,
  className = '',
}: NavigationLinkProps): React.ReactElement {
  const basePath = '/admin/dashboard';
  return (
    <>
      <Link
        to={`${basePath}/${to}`}
        className={` capitalize text-text hover:text-accent rounded-md p-2 transition-colors duration-200 ${className}`}
      >
        {children}
      </Link>
    </>
  );
}
