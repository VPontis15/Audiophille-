import { TableHeadTitlesProps } from '../../../types/Dashboard/types';
import { Skeleton } from '../../utils/skeleton';
import React from 'react';

export default function TableHeadTitles({
  isLoading,
  config,
}: TableHeadTitlesProps): React.ReactElement {
  if (isLoading) {
    return (
      <>
        {config.map((column, columnIndex) => (
          <th
            className="capitalize py-3 px-4 text-lg font-medium text-text text-center border-b"
            key={`header-${columnIndex}-${column.label}`}
          >
            <Skeleton className="h-6 w-24" />
          </th>
        ))}
      </>
    );
  }

  return (
    <>
      {config.map((column, columnIndex) => (
        <th
          className="capitalize py-3 px-4 text-lg font-medium text-text text-center border-b"
          key={`header-${columnIndex}-${column.label}`}
        >
          {column.label}
        </th>
      ))}
    </>
  );
}
