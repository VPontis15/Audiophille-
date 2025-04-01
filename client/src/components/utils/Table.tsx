export default function Table({
  data,
  config,
  keyfn,
}: {
  data: any[];
  keyfn: (item: any) => string;
  config: { label: string; render: (item: any) => React.ReactNode }[];
}): React.ReactElement {
  const tableHeaders = config.map((column, columnIndex) => {
    return (
      <th
        className="capitalize py-3  px-4 text-lg font-medium text-text  text-center border-b"
        key={`header-${columnIndex}-${column.label}`}
      >
        {column.label}
      </th>
    );
  });

  const tableRows = data.map((rowData, rowIndex) => {
    const rowKey = `row-${rowIndex}-${keyfn(rowData)}`;

    return (
      <tr className="hover:bg-gray-100 border-b last:border-b-0" key={rowKey}>
        {config.map((column, columnIndex) => {
          return (
            <td
              className="py-2.5 px-4 text-center"
              key={`cell-${rowIndex}-${columnIndex}`}
            >
              {column.render(rowData)}
            </td>
          );
        })}
      </tr>
    );
  });

  return (
    <table className="min-w-full overflow-y-auto divide-y pl-120 divide-gray-200 table-fixed">
      <thead className="bg-gray-50">
        <tr>{tableHeaders}</tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">{tableRows}</tbody>
    </table>
  );
}
