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

/**
 * A custom hook for data fetching with pagination, sorting, filtering, and search capabilities.
 *
 * @template T - The type of data items being fetched
 *
 * @param {Object} options - The configuration options for data fetching
 * @param {string} options.endpoint - The API endpoint to fetch data from
 * @param {string[]} [options.fields] - Optional list of fields to include in the response
 * @param {string} options.queryKey - The key used for React Query caching
 * @param {string} [options.defaultSort='createdAt'] - Default field to sort by
 * @param {Object} [options.initialConfig] - Initial configuration for the data fetching
 * @param {Object} [options.additionalParams={}] - Additional parameters to include in the request
 * @param {string} [options.additionalParams.searchField] - Field to use for search operations (defaults to 'name')
 *
 * @returns {Object} The fetch result and control methods
 * @returns {T[]} returns.items - The fetched data items
 * @returns {number} returns.results - Total number of results
 * @returns {number} returns.limit - Current page size limit
 * @returns {number} returns.totalPages - Total number of pages
 * @returns {number} returns.currentPage - Current page number
 * @returns {string|null} returns.error - Error message if any
 * @returns {boolean} returns.isLoading - Loading state
 * @returns {Object} returns.config - Configuration object
 * @returns {Function} returns.handleSearchChange - Function to handle search input changes
 * @returns {Function} returns.handlePageChange - Function to handle page changes
 * @returns {Function} returns.handleLimitChange - Function to handle page size limit changes
 * @returns {string} returns.searchInput - Current search input value
 * @returns {Function} returns.setSearchInput - Function to directly set search input
 * @returns {string[]} returns.LIMIT_OPTIONS - Available page size options
 */
export default function useDataFetching<T>({
  endpoint,
  fields,
  queryKey,
  defaultSort = 'createdAt',
  initialConfig,
  additionalParams = {},
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
    // Create a clean copy of additionalParams without searchField
    const cleanedParams = { ...additionalParams };
    delete cleanedParams.searchField;

    const params: Record<string, string | number | Record<string, string>> = {
      page,
      limit,
      sort,
      ...cleanedParams, // Use the cleaned version without searchField
    };

    // Add fields if provided
    if (fields) {
      params.fields = fields;
    }

    // Add search parameter if available
    if (initialSearchTerm) {
      // Get the search field from additionalParams
      const searchField = additionalParams.searchField || 'name';

      // Add the actual search field to params
      params[searchField as string] = { like: initialSearchTerm };
    }

    // Process additional filter parameters from URL
    for (const [key, value] of searchParams.entries()) {
      // Skip parameters we've already handled
      if (['page', 'limit', 'sort', 's', 'fields'].includes(key)) {
        continue;
      }

      // Add filter parameter to query
      params[key] = value;
    }

    return params;
  }, [
    page,
    limit,
    sort,
    fields,
    initialSearchTerm,
    additionalParams,
    searchParams,
  ]);

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
  const items =
    data?.data?.categories || // For hierarchical data structure
    data?.data?.[endpoint] || // For regular endpoints
    data?.categories || // Direct response formats
    data?.[endpoint] || // Alternative formats
    []; // Fallback

  const results = data?.data?.results || data?.results || items.length || 0;
  const totalPages = data?.data?.totalPages || data?.totalPages || 1;
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
