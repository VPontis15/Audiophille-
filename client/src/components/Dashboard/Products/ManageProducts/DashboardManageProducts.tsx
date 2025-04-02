import { useMemo, useRef, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import Table from '../../../utils/Table';
import { QueryParams } from '../../../../types/Dashboard/types';
import { useProductTableConfig } from '../../../../custom hooks/useProductTableConfig';
import useProductData from '../../../../custom hooks/useProductData';
import TableControls from '../../../components/TableControls';
import { Pagination } from '../../../components/Pagination';

// Options for limit select
const LIMITOPTIONS = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '50', label: '50' },
  { value: '100', label: '100' },
  { value: '200', label: '200' },
];

const fields = [
  'id',
  'name',
  'price',
  'status',
  'quantity',
  'brand',
  'category',
  'featuredImage',
  'slug',
  'createdAt',
].join(',');

export default function DashboardManageProducts(): React.ReactElement {
  // Get URL parameters
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('s') || '';
  const page = Number(searchParams.get('page') || '1');
  const limit = Number(searchParams.get('limit') || '10');
  const sort = searchParams.get('sort') || 'price';

  // Create a ref to store the timeout ID
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search handler
  const handleSearchChange = useCallback(
    (newSearch: string) => {
      // Clear any existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Set a new timeout to update search params after typing stops
      searchTimeoutRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams);

        if (!newSearch || newSearch.trim() === '') {
          params.delete('s');
        } else {
          params.set('s', newSearch.trim());
        }

        // Reset to first page when changing search
        params.set('page', '1');

        setSearchParams(params);
      }, 500); // 500ms debounce delay
    },
    [searchParams, setSearchParams]
  );

  // Handler for changing page
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
  };

  // Clean up the timeout when component unmounts
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Get table config from custom hook
  const config = useProductTableConfig();

  // Handler for changing limit
  const handleLimitChange = (newLimit: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('limit', newLimit);
    // Reset to first page when changing limit
    params.set('page', '1');
    setSearchParams(params);
  };

  // Memoize query parameters
  const queryParams = useMemo<QueryParams>(() => {
    const params: QueryParams = {
      limit,
      page,
      sort,
      fields,
    };

    // Handle search term
    if (searchTerm) {
      params.name = { like: searchTerm };
    }

    // Add any additional filter parameters from the URL
    // This will handle category=headphones and similar filters
    searchParams.forEach((value, key) => {
      // Skip parameters we've already handled
      if (['limit', 'page', 'sort', 'fields', 's'].includes(key)) {
        return;
      }

      // Add the parameter to our query
      params[key] = value;
    });

    return params;
  }, [limit, page, sort, searchTerm, searchParams]);

  // Fetch data with custom hook
  const {
    data: {
      products = [],
      results = 0,
      totalPages = 0,
      currentPage = 1,
      error = '',
    } = {},
    isLoading,
  } = useProductData(queryParams);

  // Key function for table
  const keyfn = (item: unknown) => {
    if (typeof item === 'object' && item !== null && 'id' in item) {
      return `item-${(item as { id: number }).id}`;
    }
    return String(Math.random());
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-h3 font-bold mb-6">Manage Products</h1>

      <div className="w-full bg-white pl-6 pr-2 rounded-lg">
        {/* Show error if any */}
        {error && (
          <div className="bg-red-100 text-red-800 p-3 my-3 rounded-md">
            {error}
          </div>
        )}

        {/* Table controls - limit selector, search, etc. */}
        <TableControls
          options={LIMITOPTIONS}
          currentLimit={limit}
          onLimitChange={handleLimitChange}
          onSearchChange={handleSearchChange}
        />

        {/* Main data table */}
        <div className="overflow-x-auto max-h-115 overflow-auto ">
          <Table
            isLoading={isLoading}
            error={error}
            keyfn={keyfn}
            data={products}
            config={config}
          />
        </div>

        {/* Results summary */}
        {!isLoading && results > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {products.length} of {results} items
          </div>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
