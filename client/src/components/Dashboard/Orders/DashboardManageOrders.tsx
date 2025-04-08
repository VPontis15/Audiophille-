import { Pagination } from '../../components/Pagination';
import TableControls from '../../components/TableControls';
import AdminTable from '../../components/ui/AdminTable';
import TableContent from '../../utils/TableContent';
import AdminContentWrapper from '../AdminContentWrapper';
import { keyfn } from '../../../helpers/helper';
import useDataFetching from '../../../custom hooks/useDataFetching';
import { AdminOrderProps, Column } from '../../../types/Dashboard/types';
import { Outlet } from 'react-router';

import classNames from 'classnames';
import { createPortal } from 'react-dom';
import ActionButtons from '../../utils/ActionButtons';

const orderConfig: Column[] = [
  {
    label: 'ID',
    value: 'id',
    render: (item: unknown) => {
      const column = item as AdminOrderProps;
      return column.id;
    },
    skeleton: { type: 'number' },
    sortable: true,
  },
  {
    label: "Customer's Name",
    value: 'name',
    render: (item: unknown) => {
      const column = item as AdminOrderProps;
      return column.name;
    },
    skeleton: { type: 'text' },
  },
  {
    label: 'Email',
    value: 'email',
    render: (item: unknown) => {
      const column = item as AdminOrderProps;
      return column.email;
    },
    skeleton: { type: 'text' },
  },
  {
    label: 'Phone',
    value: 'phone',
    render: (item: unknown) => {
      const column = item as AdminOrderProps;
      return column.phone;
    },
    skeleton: { type: 'text' },
  },

  {
    label: 'Total Price',
    value: 'totalPrice',
    render: (item: unknown) => {
      const column = item as AdminOrderProps;
      return `€${column.totalPrice}`;
    },
    skeleton: { type: 'number' },
  },
  {
    label: 'Status',
    value: 'status',
    render: (item: unknown) => {
      const column = item as AdminOrderProps;
      const statusClasses = classNames(
        'min-w-25 rounded-md text-xs px-5 py-3 inline-block',
        {
          'bg-green-100 text-green-800': column.status === 'delivered',
          'bg-yellow-100 text-yellow-800': column.status === 'pending',
          'bg-red-100 text-red-800': column.status === 'cancelled',
          'bg-blue-100 text-blue-800': column.status === 'shipped',
          'bg-gray-100 text-gray-800': column.status === 'processing',
        }
      );
      return <span className={statusClasses}>{column.status}</span>;
    },
    skeleton: { type: 'text' },
  },
  {
    label: 'Created At',
    value: 'createdAt',
    render: (item: unknown) => {
      const column = item as AdminOrderProps;
      return new Date(column.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    },
    skeleton: { type: 'text' },
  },
  {
    label: 'actions',
    sortable: false,
    render: (item: unknown) => {
      const column = item as AdminOrderProps;
      return (
        <ActionButtons path="/admin/dashboard/orders/manage" item={column} />
      );
    },
    skeleton: { type: 'action' },
  },
];
export default function DashboardManageOrders(): React.ReactElement {
  const {
    items: orders,
    LIMIT_OPTIONS,
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
    endpoint: 'orders',
    fields: 'id,name,email,phone,address,totalPrice,status,createdAt',
    queryKey: 'orders',
    initialConfig: orderConfig,
    additionalParams: { searchField: 'status' },
  });

  return (
    <AdminContentWrapper heading="Manage Orders">
      <AdminTable
        data={orders}
        results={results}
        isLoading={isLoading}
        error={error as string}
      >
        <TableControls
          limit={limit}
          limitOptions={LIMIT_OPTIONS}
          currentLimit={limit}
          onLimitChange={handleLimitChange}
          onSearchChange={handleSearchChange}
          options={LIMIT_OPTIONS}
        />
        <TableContent
          config={orderConfig}
          data={orders}
          error={error as string}
          keyfn={keyfn}
          isLoading={isLoading}
        />
      </AdminTable>
      <Pagination
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalPages={totalPages}
        data={orders}
        isLoading={isLoading}
        key="pagination"
        results={results}
      />
      {createPortal(<Outlet />, document.body)}
    </AdminContentWrapper>
  );
}
