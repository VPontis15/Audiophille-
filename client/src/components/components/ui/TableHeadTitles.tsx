import { TableHeadTitlesProps } from '../../../types/Dashboard/types';
import React from 'react';
import { useSearchParams } from 'react-router';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { getSortDirection, handleSort } from '../../../helpers/helper';

// Define a mapping function to handle field name transformations if needed

export default function TableHeadTitles({
  config,
  sortable = true,
}: TableHeadTitlesProps): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSort = searchParams.get('sort') || '';

  // Parse the current sort parameter, filtering out empty entries
  const sortFields = currentSort
    .split(',')
    .filter((field) => field.trim() !== '')
    .map((field) => {
      // Check if the field starts with a minus sign (for descending sort)
      if (field.startsWith('-')) {
        return { field: field.substring(1), direction: 'desc' };
      }
      return { field: field, direction: 'asc' };
    });

  return (
    <>
      {config.map((column, columnIndex) => {
        // Check if this column is sortable
        const isColumnSortable = column.sortable !== false && sortable;

        // Get the current sort direction for this column
        const sortDirection = getSortDirection(column.label, sortFields);

        // Determine if this column is actively being sorted
        const isActiveSortColumn = sortDirection !== null;

        return (
          <th
            className={`capitalize py-3 px-4 text-lg transition duration-300 text-text text-center border-b ${
              isColumnSortable ? 'cursor-pointer hover:bg-gray-100' : ''
            } ${isActiveSortColumn ? 'font-bold' : 'font-medium'}`}
            key={`header-${columnIndex}-${column.label}`}
            onClick={
              isColumnSortable
                ? () =>
                    handleSort(
                      column.label,
                      sortFields,
                      searchParams,
                      setSearchParams,
                      sortable
                    )
                : undefined
            }
            title={isColumnSortable ? 'Click to sort' : undefined}
          >
            <div className="flex items-center justify-center">
              <span>{column.label}</span>

              {/* Sort indicator */}
              {isColumnSortable && sortDirection && (
                <span className="inline-flex ml-1">
                  {sortDirection === 'asc' ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </span>
              )}
            </div>
          </th>
        );
      })}
    </>
  );
}
