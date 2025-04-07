import useDataFetching from '../../../../custom hooks/useDataFetching';
import { CategoryProps, Column } from '../../../../types/Dashboard/types';
import { Pagination } from '../../../components/Pagination';
import TableControls from '../../../components/TableControls';
import AdminTable from '../../../components/ui/AdminTable';
import TableContent from '../../../utils/TableContent';
import AdminContentWrapper from '../../AdminContentWrapper';

const brandsConfig: Column[] = [
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
    render: () => {
      return (
        <div className="flex items-center justify-center gap-x-2">
          <button
            type="button"
            className="text-blue-500 hover:text-blue-700"
            onClick={() => {}}
          >
            <FaEdit size={20} />
          </button>
          <button
            type="button"
            className="text-red-500 hover:text-red-700"
            onClick={() => {}}
          >
            <MdDeleteForever size={20} />
          </button>
        </div>
      );
    },
    skeleton: { type: 'action' },
  },
];
import { keyfn } from '../../../../helpers/helper';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';

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
  } = useDataFetching<CategoryProps[]>({
    endpoint: 'brands',
    fields: 'name,slug,createdAt',
    queryKey: 'brands/hierarchy',
    initialConfig: brandsConfig,
    additionalParams: { hierarchy: 'true' },
  });

  console.log(brands);
  return (
    <AdminContentWrapper heading="Manage brands">
      <AdminTable
        data={brands}
        isLoading={isLoading}
        error={error}
        results={results}
      >
        <TableControls
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
