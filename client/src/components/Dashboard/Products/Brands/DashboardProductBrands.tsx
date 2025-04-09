import useDataFetching from '../../../../custom hooks/useDataFetching';
import { BrandProps, Column } from '../../../../types/Dashboard/types';
import { Pagination } from '../../../components/Pagination';
import TableControls from '../../../components/TableControls';
import AdminTable from '../../../components/ui/AdminTable';
import TableContent from '../../../utils/TableContent';
import AdminContentWrapper from '../../AdminContentWrapper';
import { keyfn } from '../../../../helpers/helper';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { Link } from 'react-router';
import ActionButtons from '../../../utils/ActionButtons';
const brandsConfig: Column[] = [
  {
    label: 'name',
    value: 'name',
    render: (item: unknown) => {
      const column = item as BrandProps;
      return column.name;
    },
    skeleton: { type: 'text' },
  },
  {
    label: 'slug',
    value: 'slug',
    render: (item: unknown) => {
      const column = item as BrandProps;
      return column.slug;
    },
    skeleton: { type: 'text' },
  },
  {
    label: 'createdAt',
    value: 'createdAt',
    render: (item: unknown) => {
      const column = item as BrandProps;
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
    render: (item: unknown) => {
      const column = item as BrandProps;
      return (
        <ActionButtons path="/admin/dashboard/products/brands" item={column} />
      );
    },
    skeleton: { type: 'action' },
  },
];

export default function DashboardProductBrands(): React.ReactElement {
  const {
    items: brands,
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
  } = useDataFetching<BrandProps[]>({
    endpoint: 'brands',
    fields: 'name,slug,createdAt',
    queryKey: 'brands',
    initialConfig: brandsConfig,
  });

  return (
    <AdminContentWrapper heading="Manage brands">
      <AdminTable
        data={brands}
        isLoading={isLoading}
        error={error}
        results={results}
      >
        <TableControls
          limit={limit}
          limitOptions={LIMIT_OPTIONS}
          addBtn={true}
          addLink="/admin/dashboard/products/brands/create"
          currentLimit={limit}
          onLimitChange={handleLimitChange}
          onSearchChange={handleSearchChange}
          options={LIMIT_OPTIONS}
        />
        <TableContent
          config={brandsConfig}
          data={brands}
          keyfn={keyfn}
          error={error}
          isLoading={isLoading}
        />
        <Pagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={totalPages}
          data={brands}
          isLoading={isLoading}
          results={results}
        />
      </AdminTable>
    </AdminContentWrapper>
  );
}
