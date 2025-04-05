import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';
import API from '../api/API';
import { useMemo, useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { DataFetchingProps } from '../types/Dashboard/apiResponses';

export const LIMIT_OPTIONS = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '50', label: '50' },
  { value: '100', label: '100' },
  { value: '200', label: '200' },
];

export default function useDataFetching<T>({
  endpoint,
  fields,
  queryKey,
  defaultSort = 'createdAt',
  initialConfig,
}: DataFetchingProps<T>) {
  // URL parameter handling
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || '1');
  const limit = Number(searchParams.get('limit') || '10');
  const sort = searchParams.get('sort')?.toLowerCase() || defaultSort;
  const initialSearchTerm = searchParams.get('s') || '';

  // Search state
  const [searchInput, setSearchInput] = useState(initialSearchTerm);
  const debouncedSearch = useDebounce(searchInput, 500);

  // Configuration
  const config = useMemo(() => initialConfig, [initialConfig]);

  // Effect to update URL when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== initialSearchTerm) {
      const params = new URLSearchParams(searchParams);

      if (!debouncedSearch) {
        params.delete('s');
      } else {
        params.set('s', debouncedSearch);
      }

      params.set('page', '1');
      setSearchParams(params);
    }
  }, [debouncedSearch, initialSearchTerm, searchParams, setSearchParams]);

  // Build query parameters
  const queryParams = useMemo(() => {
    const params: Record<string, string | number | Record<string, string>> = {
      page,
      limit,
      sort,
    };

    // Add fields if provided
    if (fields) {
      params.fields = fields;
    }

    // Add search parameter if available
    if (initialSearchTerm) {
      params.name = { like: initialSearchTerm };
    }

    return params;
  }, [page, limit, sort, fields, initialSearchTerm]);

  // Fetch data
  const api = new API();
  const {
    data,
    isLoading,
    error: queryError,
  } = useQuery<any>({
    queryKey: [queryKey, page, limit, sort, initialSearchTerm],
    queryFn: async () => {
      try {
        const response = await api.fetchAll<any>(endpoint, queryParams);
        return response;
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
      }
    },
  });

  // Handler for search input
  const handleSearchChange = useMemo(
    () => (newSearch: string) => {
      setSearchInput(newSearch);
    },
    []
  );

  // Handler for changing page
  const handlePageChange = useMemo(
    () => (newPage: number) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', String(newPage));
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  // Handler for changing limit
  const handleLimitChange = (newLimit: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('limit', newLimit);
    // Reset to first page when changing limit
    params.set('page', '1');
    setSearchParams(params);
  };

  // Extract data with fallbacks - works with both nested and flat structures
  const items = data?.data?.[endpoint] || data?.[endpoint] || [];
  const results = data?.data?.results || data?.results || 0;
  const totalPages = data?.data?.totalPages || data?.totalPages || 0;
  const currentPage = data?.data?.currentPage || data?.currentPage || 1;
  const responseError =
    data?.data?.error || data?.error || queryError?.message || null;

  return {
    items,
    results,
    limit,
    totalPages,
    currentPage,
    error: responseError,
    isLoading,
    config,
    handleSearchChange,
    handlePageChange,
    handleLimitChange,
    searchInput,
    setSearchInput,
    LIMIT_OPTIONS,
  };
}
