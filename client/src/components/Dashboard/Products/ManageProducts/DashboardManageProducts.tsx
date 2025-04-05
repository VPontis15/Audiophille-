import { useMemo, useEffect, useState } from 'react';
import { Outlet, useSearchParams } from 'react-router';
import { QueryParams } from '../../../../types/Dashboard/types';
import { useProductTableConfig } from '../../../../custom hooks/useProductTableConfig';
import useProductData from '../../../../custom hooks/useProductData';

import { createPortal } from 'react-dom';
import AdminTable from '../../../components/ui/AdminTable';
import { Pagination } from '../../../components/Pagination';
import TableContent from '../../../utils/TableContent';
import TableControls from '../../../components/TableControls';
import AdminContentWrapper from '../../AdminContentWrapper';
import { useDebounce } from '../../../../custom hooks/useDebounce';
import { keyfn } from '../../../../helpers/helper';
// Options for limit select
const LIMITOPTIONS = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '50', label: '50' },
  { value: '100', label: '100' },
  { value: '200', label: '200' },
];

const PRODUCT_FIELDS = [
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
  'salePrice',
].join(',');

export default function DashboardManageProducts(): React.ReactElement {
  // Get URL parameters
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || '1');
  const limit = Number(searchParams.get('limit') || '10');
  const sort = searchParams.get('sort') || 'price';
  const initialSearchTerm = searchParams.get('s') || '';

  const [searchInput, setSearchInput] = useState(initialSearchTerm);
  const debouncedSearch = useDebounce(searchInput, 500);

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
  const config = useProductTableConfig();
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

  // Get table config from custom hook

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
      fields: PRODUCT_FIELDS,
    };

    // Handle search term
    if (debouncedSearch) {
      params.name = { like: debouncedSearch };
    }

    // Add additional filter parameters
    searchParams.forEach((value, key) => {
      if (!['limit', 'page', 'sort', 'fields', 's'].includes(key)) {
        params[key] = value;
      }
    });

    return params;
  }, [limit, page, sort, debouncedSearch, searchParams]);

  // Fetch data with custom hook
  const { data, isLoading } = useProductData(queryParams);

  const {
    products = [],
    results = 0,
    totalPages = 0,
    currentPage = 1,
    error,
  } = data || {}; // Default empty object for data if it's undefined

  return (
    <AdminContentWrapper heading="Manage Products">
      <AdminTable
        error={error as string}
        data={products}
        isLoading={isLoading}
        results={results}
      >
        <TableControls
          options={LIMITOPTIONS}
          currentLimit={limit}
          onLimitChange={handleLimitChange}
          onSearchChange={handleSearchChange}
        />
        <div className="overflow-x-auto max-h-115 overflow-auto rounded-t-lg">
          <TableContent
            isLoading={isLoading}
            error={error}
            keyfn={keyfn}
            data={products}
            config={config}
          />
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={isLoading}
          results={results}
          data={products}
          onPageChange={handlePageChange}
        />
      </AdminTable>
      {createPortal(<Outlet />, document.body)}
    </AdminContentWrapper>
  );
}
