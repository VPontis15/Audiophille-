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

export interface AdminOrderProps {
  id: number | string;
  name: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  phone: string;
  totalPrice: number;
  status: string;
  shippedAt: string;
  createdAt: string;
  updatedAt: string;
  userId: number | string;
  orderItems: {
    productId: number | string;
    quantity: number;
    price: number;
    productName: string;
    productImage: string;
  }[];
}

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
  value?: string;
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

export interface AdminTableProps {
  isLoading: boolean;
  error: string;
  data: unknown[];
  results: number;
  children?: React.ReactNode;
}

export interface CategoryProps {
  id: number | string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface TableControlsProps {
  addLink?: string;
  addBtn?: boolean;
  limit: string | number;
  limitOptions: Array<{ value: string; label: string }>;
  options: Array<{ value: string; label: string }>;
  currentLimit: string | number;
  onLimitChange: (limit: string) => void;
  onSearchChange: (search: string) => void;
}
