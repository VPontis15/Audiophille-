import Button from '../../../utils/Button';
import Table from '../../../utils/Table';
import API from '../../../../api/API';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';
import {
  AdminProductProps,
  APIResponse,
  Column,
  QueryParams,
} from '../../../../types/Dashboard/types';
import { Skeleton } from '../../../utils/skeleton';

export default function DashboardManageProducts(): React.ReactElement {
  const keyfn = (item: unknown) => {
    // Use ID if available, otherwise fall back to label
    if (typeof item === 'object' && item !== null && 'id' in item) {
      return `item-${(item as { id: number }).id}`;
    }
    if (typeof item === 'string') {
      return `column-${item}`;
    }
    if (typeof item === 'object' && item !== null && 'label' in item) {
      return `label-${(item as { label: string }).label}`;
    }
    return String(item);
  };
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('s') || '';

  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 10;
  const sort = searchParams.get('sort') || 'price';

  // Get fields from searchParams

  const config: Column[] = [
    {
      label: 'id',
      render: (item: unknown) => {
        const column = item as AdminProductProps;
        return column.id;
      },
      skeleton: { type: 'number' },
    },
    {
      label: 'status',
      render: (item: unknown) => {
        const column = item as AdminProductProps;
        return (
          <span
            className={`min-w-25 rounded-md text-xs px-5 py-3 inline-block ${
              column.status === 'published'
                ? 'bg-green-100 text-green-800 '
                : 'bg-yellow-100 text-yellow-800 '
            }`}
          >
            {column.status}
          </span>
        );
      },
      skeleton: { type: 'status' },
    },
    {
      label: 'image',
      render: (item: unknown) => {
        const column = item as AdminProductProps;
        if (!column.featuredImage) {
          return (
            <Skeleton className="w-14.5 h-14.5 rounded-md object-cover mx-auto" />
          );
        }

        try {
          const src = JSON.parse(column.featuredImage);
          return (
            <img
              width={58}
              height={58}
              loading="lazy"
              className="w-14.5 h-14.5 rounded-md object-cover mx-auto"
              src={src.thumbnail.url}
              alt={column.name}
            />
          );
        } catch (error) {
          console.error('Error parsing featuredImage JSON:', error);
          return (
            <Skeleton className="w-14.5 h-14.5 rounded-md object-cover mx-auto" />
          );
        }
      },
      skeleton: { type: 'image' },
    },
    {
      label: 'name',
      render: (item: unknown) => {
        const column = item as AdminProductProps;
        return column.name;
      },
      skeleton: { type: 'text' },
    },
    {
      label: 'quantity',
      render: (item: unknown) => {
        const column = item as AdminProductProps;
        return column.countInStock;
      },
      skeleton: { type: 'number' },
    },
    {
      label: 'price',
      render: (item: unknown) => {
        const column = item as AdminProductProps;
        return `$${column.price}`;
      },
      skeleton: { type: 'number' },
    },
    {
      label: 'category',
      render: (item: unknown) => {
        const column = item as AdminProductProps;
        return column.category;
      },
      skeleton: { type: 'text' },
    },
    {
      label: 'brand',
      render: (item: unknown) => {
        const column = item as AdminProductProps;
        return column.brand;
      },
      skeleton: { type: 'text' },
    },
    {
      label: 'actions',
      render: () => (
        <div className="flex gap-2 justify-center">
          <Button sm primary>
            View
          </Button>
          <Button sm secondary>
            Delete
          </Button>
        </div>
      ),
      skeleton: { type: 'action' },
    },
  ];

  const fields = Object.keys({
    id: true,
    name: true,
    price: true,
    status: true,
    countInStock: true,
    brand: true,
    category: true,
    featuredImage: true,
  }).join(',');

  const queryParams: QueryParams = {
    limit: limit,
    page: page,
    sort: sort,
    fields: fields,
  };

  // Only add search parameter if a search term exists
  if (searchTerm) {
    queryParams.name = { like: searchTerm };
  }

  const api = new API();
  const queryKey = ['products', page, limit, sort, fields, searchTerm];

  const {
    data: {
      products = [],
      results = 0,
      totalPages = 0,
      currentPage = 1,
      error = '',
    } = {},
    isLoading,
  } = useQuery<APIResponse>({
    queryKey: queryKey,
    queryFn: async () => {
      try {
        const response = await api.fetchAll<APIResponse>(
          'products',
          queryParams
        );
        return response;
      } catch (error) {
        console.error('Error fetching products:', error);
        throw error; // Rethrow the error to handle it in the component
      }
    },
  });
  console.log(totalPages, currentPage, results, products);
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-h3 font-bold mb-6">Manage Products</h1>

      <div className="w-full bg-white px-6 rounded-lg ">
        <div className="overflow-x-auto">
          {!isLoading && (
            <span className="text-right inline-block w-full">
              Results: {results}
            </span>
          )}
          <Table
            isLoading={isLoading}
            error={error}
            keyfn={keyfn}
            data={products}
            config={config}
          />
        </div>
      </div>
    </div>
  );
}
