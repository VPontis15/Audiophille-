import { NavSubMenuProps } from '../../../types/Dashboard/types';

export default function NavSubMenu({
  children,
  parentId,
  className = '',
  isOpen = false,
}: NavSubMenuProps): React.ReactElement {
  return (
    <ul
      data-parent-id={parentId}
      className={`nav-sub-menu    z-50 flex flex-col  ${className} ${
        isOpen ? 'opened ' : ' overflow-clip '
      }`}
    >
      {children}
    </ul>
  );
}
