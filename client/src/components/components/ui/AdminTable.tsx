import { AdminTableProps } from '../../../types/Dashboard/types';

export default function AdminTable({
  error,

  children,
}: AdminTableProps): React.ReactElement {
  return (
    <>
      <div className="w-full bg-white pl-6 pr-2 rounded-lg">
        {/* Show error if any */}
        {error && (
          <div className="bg-red-100 text-red-800 p-3 my-3 rounded-md">
            {error}
          </div>
        )}
        {children}
      </div>
    </>
  );
}
