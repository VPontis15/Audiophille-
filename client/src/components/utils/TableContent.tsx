import TableHeadTitles from '../components/ui/TableHeadTitles';
import TableRows from '../components/ui/TableRows';

import { Column } from '../../types/Dashboard/types';

export default function TableContent({
  data,
  isLoading,
  config,
  keyfn,
}: {
  data: unknown[];
  isLoading?: boolean;
  error?: string;
  keyfn: (item: unknown) => string;
  config: Column[];
}): React.ReactElement {
  return (
    <table className="min-w-full rounded-t-lg overflow-y-auto divide-y pl-120 divide-gray-200 table-fixed">
      <thead className="bg-gray-100  ">
        <tr>
          <TableHeadTitles config={config} />
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        <TableRows
          config={config}
          isLoading={Boolean(isLoading)}
          data={data}
          keyfn={keyfn}
        />
      </tbody>
    </table>
  );
}
