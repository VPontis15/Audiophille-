import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

export default function Link({
  children,
  href,
  ...props
}: {
  children: ReactNode;
  href: string;
}): React.ReactElement {
  return (
    <NavLink
      {...props}
      to={href}
      className="text-white uppercase tracking-main hover:text-accent transition duration-300 ease-in-out"
    >
      {children}
    </NavLink>
  );
}
