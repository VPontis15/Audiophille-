import { NavItemProps } from '../../../types/Dashboard/types';

/**
 * A navigation item component for dashboard navigation.
 *
 * @param props - The component props
 * @param props.id - The HTML id attribute for the navigation item
 * @param props.children - The content to be rendered inside the navigation item
 * @param props.className - Additional CSS classes to apply to the navigation item (optional, default: '')
 * @param props.isActive - Whether the navigation item is currently active (optional, default: false)
 * @param props.activeClassName - CSS class to apply when the item is active (optional, default: 'text-accent')
 * @param props.onClick - Function to call when the navigation item is clicked (optional, default: no-op function)
 * @returns A React element representing a navigation item
 */
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
