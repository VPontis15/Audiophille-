import NavItem from './NavItem';
import NavigationLink from './NavigationLink';
import NavSubMenu from './NavSubMenu';
import dataNavigation from '../../../data/dashboard-navigation.json';
import { useState, useEffect, useCallback } from 'react';
import { MdOutlineArrowRight } from 'react-icons/md';
import NavigationIcon from './NavigationIcon';
import Logo from '../../utils/Logo';
import { useLocation } from 'react-router';

// Add a constant for the base path
const BASE_PATH = '/admin/dashboard';

export default function Navigation(): React.ReactElement {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const { pathname } = useLocation();

  // Update to toggle only the specific submenu
  const handleToggleSubmenu = (id: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Check if a path is active by comparing if the pathname includes the path
  const isPathActive = useCallback(
    (path: string) => {
      // For root paths, ensure it's an exact match or has a trailing slash
      if (path === '') {
        return pathname === BASE_PATH || pathname === `${BASE_PATH}/`;
      }

      // For other paths, check if pathname includes the path
      // We need to make sure we're matching the full path segment
      return (
        pathname === `${BASE_PATH}/${path}` ||
        pathname.startsWith(`${BASE_PATH}/${path}/`)
      );
    },
    [pathname]
  );

  // Effect to keep submenu open when a child item is selected
  useEffect(() => {
    // Initialize with all menus closed
    const newOpenState: Record<string, boolean> = {};

    // For each navigation item
    dataNavigation.forEach((item) => {
      // Check if current path matches this item
      if (isPathActive(item.path)) {
        newOpenState[item.id] = true;
        return;
      }

      // Check if any child paths match current path
      const hasActiveChild = item.children.some((child) =>
        isPathActive(child.path)
      );
      if (hasActiveChild) {
        newOpenState[item.id] = true;
      }
    });

    // Set the open state based on the current path
    // Preserve existing open states to prevent flickering
    setOpenMenus((prev) => {
      const result = { ...prev };

      // Only update states that need to be open
      Object.keys(newOpenState).forEach((key) => {
        if (newOpenState[key]) {
          result[key] = true;
        }
      });

      return result;
    });
  }, [pathname, isPathActive]);

  // Prevent default link behavior for submenu items
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubMenuItemClick = (e: React.MouseEvent, parentId: string) => {
    // Don't close the submenu when clicking a child item
    e.stopPropagation();
  };

  return (
    <>
      <nav className="bg-black text-white w-full grid min-h-screen p-4">
        <Logo />
        <ul className="grid h-full text-center items-center">
          {dataNavigation.map((item, i: number) => {
            // Check if this item or any of its children is active
            const isItemActive = isPathActive(item.path);

            return (
              <NavItem
                className={`text-white group group-hover:text-accent ${
                  isItemActive ? 'text-accent' : ''
                }`}
                onClick={() => handleToggleSubmenu(item.id)}
                id={item.id}
                key={i}
              >
                <div className="flex items-center ">
                  <NavigationIcon
                    widths={20}
                    height={20}
                    name={item.icon}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <NavigationLink
                    className={`text-white ${
                      isItemActive ? 'text-accent' : ''
                    }`}
                    id={item.id}
                    to={`${item.children[0]?.path}`}
                  >
                    {item.name}
                  </NavigationLink>
                  {openMenus[item.id] ? (
                    <MdOutlineArrowRight
                      widths={20}
                      height={20}
                      className="rotate-90 cursor-pointer transition-transform duration-300 h-5 w-5"
                    />
                  ) : (
                    <MdOutlineArrowRight
                      widths={20}
                      height={20}
                      className="transition-transform duration-300 h-5 w-5 cursor-pointer"
                    />
                  )}
                </div>
                <NavSubMenu isOpen={!!openMenus[item.id]} parentId={item.id}>
                  {item.children.map((child, id: number) => {
                    const isChildActive = isPathActive(child.path);
                    return (
                      <NavItem
                        id={child.id}
                        key={id}
                        className={isChildActive ? 'text-accent' : ''}
                        onClick={(e) => handleSubMenuItemClick(e, item.id)}
                      >
                        <NavigationLink
                          className={`text-white ${
                            isChildActive ? '!text-accent font-bold' : ''
                          }`}
                          id={child.id}
                          to={`${child.path}`}
                        >
                          {child.name}
                        </NavigationLink>
                      </NavItem>
                    );
                  })}
                </NavSubMenu>
              </NavItem>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
