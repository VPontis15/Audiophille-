import React from 'react';
import { ImageVariant } from '../ProductTypes';

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

export interface QueryParams {
  page?: string | number;
  limit?: string | number;
  sort?: string;
  fields?: string;
  [key: string]: string | number | boolean | { like?: string } | undefined;
}

export interface AdminProductProps {
  id: number | string;
  name: string;
  status: string;
  price: number;
  quantity: number;
  brand: string;
  category: string;
  featuredImage: string;
  createdAt: string;
  thumbnail?: ImageVariant; // New thumbnail variant
  slug?: string;
  salePrice?: number;
}

export type APIResponse = {
  products: AdminProductProps[];
  results: number;
  totalPages: number;
  currentPage: number;
  error?: string;
};

export interface TableProps<T> {
  data: T[];
  isLoading?: boolean;
  error?: string;
  keyfn: (item: T) => string;
  skeleton?: {
    width?: string;
    height?: string;
    className?: string;
    type?: 'text' | 'image' | 'action' | 'status' | 'number';
  };
  config: { label: string; render: (item: T) => React.ReactNode }[];
}
export interface TableHeaderProps {
  label: string;
  render: (item: unknown) => React.ReactNode;
  isLoading?: boolean;
  skeleton?: {
    width?: string;
    height?: string;
    className?: string;
    type?: 'text' | 'image' | 'action' | 'status' | 'number';
  };
}

export interface Column {
  label: string;
  sortable?: boolean;
  render: (item: unknown) => React.ReactNode;
  skeleton?: {
    type?: 'number' | 'image' | 'text' | 'action' | 'status';
    width?: string;
    height?: string;
    className?: string;
  };
}

export interface TableHeadTitlesProps {
  config: Column[];
  sortable?: boolean;
}

export interface TableRowsProps {
  config: Column[];
  isLoading: boolean;
  data: unknown[];
  keyfn: (item: unknown) => string;
}
