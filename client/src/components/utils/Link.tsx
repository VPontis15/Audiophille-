import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

export default function Link({
  children,
  href,
  className,
  ...props
}: {
  children: ReactNode;
  href: string;
  className?: string;
}): React.ReactElement {
  return (
    <NavLink
      {...props}
      to={href}
      className={` uppercase tracking-main hover:text-accent transition duration-300 ease-in-out ${className}`}
    >
      {children}
    </NavLink>
  );
}
