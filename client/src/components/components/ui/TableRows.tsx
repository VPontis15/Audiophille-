import { TableRowsProps } from '../../../types/Dashboard/types';
import { Skeleton } from '../../utils/skeleton';

export default function TableRows({
  config,
  isLoading,
  data,
  keyfn,
}: TableRowsProps): React.ReactElement {
  if (isLoading) {
    const skeletonCount = data.length || 5;
    if (skeletonCount) {
      return (
        <>
          {Array(skeletonCount)
            .fill(0)
            .map((_, rowIndex) => {
              return (
                <tr className="border-b" key={`skeleton-row-${rowIndex}`}>
                  {config.map((column, colIndex) => {
                    const skeletonProps = {
                      className: 'h-6 w-20 mx-auto', // Default
                    };

                    if (column.skeleton) {
                      const { width, height, className, type } =
                        column.skeleton;

                      if (className) {
                        skeletonProps.className = className;
                      } else if (type) {
                        switch (type) {
                          case 'image':
                            skeletonProps.className =
                              'w-14.5 h-14.5 rounded-md mx-auto';
                            break;
                          case 'action':
                            return (
                              <td
                                key={`skeleton-cell-${rowIndex}-${colIndex}`}
                                className="py-2.5 px-4 text-sm text-center"
                              >
                                <div className="flex gap-2 justify-center">
                                  <Skeleton className="w-16 h-8 rounded-md" />
                                  <Skeleton className="w-16 h-8 rounded-md" />
                                </div>
                              </td>
                            );
                          case 'status':
                            skeletonProps.className =
                              'h-8 w-24 rounded-md mx-auto';
                            break;
                          case 'number':
                            skeletonProps.className = 'h-6 w-12 mx-auto';
                            break;
                        }
                      } else {
                        if (width || height) {
                          skeletonProps.className = `${
                            height ? `h-${height}` : 'h-6'
                          } ${width ? `w-${width}` : 'w-20'} mx-auto`;
                        }
                      }
                    }

                    return (
                      <td
                        className="py-2.5 px-4 text-sm text-center"
                        key={`skeleton-cell-${rowIndex}-${colIndex}`}
                      >
                        <Skeleton className={skeletonProps.className} />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
        </>
      );
    }
  }

  const tableRows = data.map((rowData, rowIndex) => {
    const rowKey = `row-${rowIndex}-${keyfn(rowData)}`;
    return (
      <tr className="hover:bg-gray-100 border-b last:border-b-0" key={rowKey}>
        {config.map((column, columnIndex) => {
          return (
            <td
              className="py-2.5 px-4 text-sm text-center"
              key={`cell-${rowIndex}-${columnIndex}`}
            >
              {column.render(rowData)}
            </td>
          );
        })}
      </tr>
    );
  });

  return <>{tableRows}</>;
}
