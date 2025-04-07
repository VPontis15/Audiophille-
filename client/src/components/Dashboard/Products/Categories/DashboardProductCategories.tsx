import useDataFetching from '../../../../custom hooks/useDataFetching';
import { CategoryProps, Column } from '../../../../types/Dashboard/types';
import { Pagination } from '../../../components/Pagination';
import TableControls from '../../../components/TableControls';
import AdminTable from '../../../components/ui/AdminTable';
import TableContent from '../../../utils/TableContent';
import AdminContentWrapper from '../../AdminContentWrapper';
import { keyfn } from '../../../../helpers/helper';
import { createPortal } from 'react-dom';
import ActionButtons from '../../../utils/ActionButtons';
import { Outlet } from 'react-router-dom';

const categoriesConfig: Column[] = [
  {
    label: 'name',
    value: 'name',
    render: (item: unknown) => {
      const column = item as CategoryProps;
      return column.name;
    },
    skeleton: { type: 'text' },
  },
  {
    label: 'slug',
    value: 'slug',
    render: (item: unknown) => {
      const column = item as CategoryProps;
      return column.slug;
    },
    skeleton: { type: 'text' },
  },
  {
    label: 'createdAt',
    value: 'createdAt',
    render: (item: unknown) => {
      const column = item as CategoryProps;
      return new Date(column.createdAt).toLocaleDateString('gr-GR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    },
    skeleton: { type: 'text' },
  },
  {
    label: 'actions',
    value: 'actions',
    sortable: false,
    render: (column: unknown) => {
      const item = column as CategoryProps;
      return (
        <ActionButtons
          path="/admin/dashboard/products/categories"
          item={item}
        />
      );
    },
    skeleton: { type: 'action' },
  },
];

export default function DashboardProductCategories(): React.ReactElement {
  const {
    items: categories,
    LIMIT_OPTIONS,
    currentPage,
    error,
    handleLimitChange,
    handlePageChange,
    handleSearchChange,
    isLoading,
    limit,
    results,

    totalPages,
  } = useDataFetching<CategoryProps[]>({
    endpoint: 'categories',
    fields: 'name,slug,createdAt,subcategories',
    queryKey: 'categories',
    initialConfig: categoriesConfig,
  });

  return (
    <AdminContentWrapper heading="Manage Categories">
      <AdminTable
        data={categories}
        isLoading={isLoading}
        error={error}
        results={results}
      >
        <TableControls
          addBtn
          addLink="/admin/dashboard/products/categories/create"
          limit={limit}
          onLimitChange={handleLimitChange}
          onSearchChange={handleSearchChange}
          limitOptions={LIMIT_OPTIONS}
          currentLimit={limit}
          options={LIMIT_OPTIONS}
        />

        <TableContent
          config={categoriesConfig}
          data={categories}
          keyfn={keyfn}
          error={error}
          isLoading={isLoading}
        />
        <Pagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={totalPages}
          data={categories}
          isLoading={isLoading}
          results={results}
        />
      </AdminTable>
      {createPortal(<Outlet />, document.body)}
    </AdminContentWrapper>
  );
}
