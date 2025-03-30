import React from 'react';

export interface NavigationLinkProps {
  id: string;
  to?: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  isActive?: boolean;
  name?: string;
  icon?: React.ReactNode;
  parentId?: string;
}

export interface NavSubMenuProps {
  children: React.ReactNode;
  parentId?: string;
  className?: string;
  isOpen?: boolean;
}

export interface NavItemProps {
  id: string;
  children: React.ReactNode;
  isActive?: boolean;
  activeClassName?: string;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLLIElement>) => void;
}
