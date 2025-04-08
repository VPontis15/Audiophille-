import TableHeadTitles from '../components/ui/TableHeadTitles';
import { CategoryProps, TableConfig } from '../../types/Dashboard/tableTypes';
import { createPortal } from 'react-dom';

export default function CategoriesTableContent({
  data,
  isLoading,
  error,
  config,
}: {
  data: CategoryProps[];
  isLoading: boolean;
  error: string | null;
  config: TableConfig<CategoryProps>;
}): React.ReactElement {
  return (
    <div className="overflow-x-auto max-h-115 overflow-auto rounded-t-lg">
      <div
        role="table"
        className="min-w-full rounded-t-lg overflow-y-auto divide-y pl-120 divide-gray-200 table-fixed"
      >
        <thead role="heading" className="bg-gray-100">
          <div role="rowgroup" className="flex w-full">
            {config.map((column) => (
              <div
                key={`header-${column.key}`}
                className="flex-1 p-3 text-left text-lg font-medium text-text"
                role="columnheader"
              >
                {column.label}
              </div>
            ))}
          </div>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((category) => (
            <div key={category.id} className="category-group">
              {/* Main category row */}
              <div role="row" className="flex flex-row bg-gray-50 font-medium">
                {config.map((column) => (
                  <div
                    key={column.key}
                    className="flex-1 p-3 text-left capitalize"
                  >
                    {column.render(category)}
                  </div>
                ))}
              </div>

              {/* Subcategories */}
              {category.subcategories && category.subcategories.length > 0 && (
                <div className="subcategories pl-6">
                  {category.subcategories.map((subcategory) => (
                    <div
                      role="row"
                      key={subcategory.id}
                      className="flex flex-row border-t border-gray-100"
                    >
                      {config.map((column) => (
                        <div key={column.key} className="flex-1 p-3 lowercase">
                          {column.render(subcategory)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </tbody>
      </div>
    </div>
  );
}
