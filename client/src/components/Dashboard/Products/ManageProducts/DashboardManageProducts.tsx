import { Link, Outlet } from 'react-router';
import {
  AdminOrderProps,
  AdminProductProps,
  Column,
} from '../../../../types/Dashboard/types';

import { createPortal } from 'react-dom';
import AdminTable from '../../../components/ui/AdminTable';
import { Pagination } from '../../../components/Pagination';
import TableContent from '../../../utils/TableContent';
import TableControls from '../../../components/TableControls';
import AdminContentWrapper from '../../AdminContentWrapper';
import { keyfn } from '../../../../helpers/helper';
import useDataFetching from '../../../../custom hooks/useDataFetching';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { Skeleton } from '../../../utils/skeleton';
import ActionButtons from '../../../utils/ActionButtons';

const config: Column[] = [
  {
    label: 'id',
    value: 'id',
    render: (item: unknown) => {
      const column = item as AdminProductProps;
      return column.id;
    },
    skeleton: { type: 'number' },
  },
  {
    label: 'status',
    value: 'status',
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
    value: 'featuredImage',
    sortable: false,
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
    value: 'name',
    render: (item: unknown) => {
      const column = item as AdminProductProps;
      return column.name;
    },
    skeleton: { type: 'text' },
  },
  {
    label: 'quantity',
    value: 'quantity',
    sortable: true,
    render: (item: unknown) => {
      const column = item as AdminProductProps;
      return (
        <span
          className={`font-bold ${
            column.quantity ? 'text-green-500' : 'text-error'
          }`}
        >
          {column.quantity ? `in stock(${column.quantity})` : 'Out of stock'}
        </span>
      );
    },
    skeleton: { type: 'number' },
  },
  {
    label: 'price',
    value: 'price',
    sortable: true,
    render: (item: unknown) => {
      const column = item as AdminProductProps;
      return column.salePrice ? (
        <div className="flex flex-col gap-1">
          <span className=" line-through text-xs">{`$${column.price}`}</span>
          <span className="">${column.salePrice}</span>
        </div>
      ) : (
        `€${column.price}`
      );
    },
    skeleton: { type: 'number' },
  },
  {
    label: 'category',
    value: 'category',
    sortable: true,
    render: (item: unknown) => {
      const column = item as AdminProductProps;
      return column.category;
    },
    skeleton: { type: 'text' },
  },
  {
    label: 'brand',
    value: 'brand',
    sortable: true,
    render: (item: unknown) => {
      const column = item as AdminProductProps;
      return column.brand;
    },
    skeleton: { type: 'text' },
  },
  {
    label: 'actions',
    sortable: false,
    render: (item: unknown) => {
      const column = item as AdminProductProps;
      return (
        <ActionButtons path="/admin/dashboard/products/manage" item={column} />
      );
    },
    skeleton: { type: 'action' },
  },
];

// Options for limit select

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
  const {
    items: products,
    LIMIT_OPTIONS: LIMITOPTIONS,
    currentPage,
    error,
    limit,
    handleLimitChange,
    handlePageChange,
    handleSearchChange,
    isLoading,
    results,
    totalPages,
  } = useDataFetching<AdminOrderProps>({
    endpoint: 'products',
    fields: PRODUCT_FIELDS,
    queryKey: 'products',
    initialConfig: config,
  });

  return (
    <AdminContentWrapper heading="Manage Products">
      <AdminTable
        error={error as string}
        data={products}
        isLoading={isLoading}
        results={results}
      >
        <TableControls
          limit={limit}
          limitOptions={LIMITOPTIONS}
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
