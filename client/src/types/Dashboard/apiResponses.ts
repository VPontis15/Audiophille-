import { AdminOrderProps, AdminProductProps, Column } from './types';

export type ProductAPIResponse = {
  products: AdminProductProps[];
  results: number;
  totalPages: number;
  currentPage: number;
  error?: string;
};

export type OrderAPIResponse = {
  data: {
    orders: AdminOrderProps[];
    results: number;
    totalPages: number;
    currentPage: number;
    error?: string;
  };
};

export type DataFetchingProps<T> = {
  endpoint: string; // API endpoint (e.g., 'orders', 'products')
  fields?: string; // Comma-separated fields to return
  queryKey: string; // React Query key
  defaultSort?: string; // Default sort field
  initialConfig: Column[]; // Table configuration
};
