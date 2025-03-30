import { NavItemProps } from '../../../types/Dashboard/types';

export default function NavItem({
  id,
  children,
  className = '',
  isActive = false,
  activeClassName = 'text-accent',
  onClick = () => {},
}: NavItemProps): React.ReactElement {
  const classNames = `text-text  relative group text-left  hover:text-accent  rounded-md p-2 transition-colors duration-200 ${className} ${
    isActive ? activeClassName : ''
  }`;
  return (
    <li id={id} onClick={onClick} className={classNames}>
      {children}
    </li>
  );
}
