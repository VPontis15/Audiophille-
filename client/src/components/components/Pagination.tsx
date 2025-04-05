import { getPageNumbers } from '../../helpers/helper';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { GrFormPrevious } from 'react-icons/gr';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  results?: number;
  data?: unknown[];
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  results = 0,
  data = [],
}: PaginationProps) {
  // No need to render pagination if there's only one page
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(totalPages, currentPage);

  return (
    <div className="flex justify-between items-center py-4">
      {!isLoading && results > 0 && (
        <div className=" text-sm text-gray-600">
          Showing {data.length} of {results} items
        </div>
      )}
      <div>
        <p className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      <div className="flex space-x-1">
        {/* First page button */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-2 py-1 rounded-md border disabled:opacity-50 flex items-center"
          aria-label="Go to first page"
        >
          <svg
            className="cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="11 17 6 12 11 7"></polyline>
            <polyline points="18 17 13 12 18 7"></polyline>
          </svg>
        </button>

        {/* Previous button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md border disabled:opacity-50"
          aria-label="Go to previous page"
        >
          <GrFormPrevious className="w-5 h-5 cursor-pointer" />
        </button>

        {/* Page numbers with ellipsis */}
        {pageNumbers.map((pageNumber) => {
          // Render ellipsis
          if (pageNumber < 0) {
            return (
              <span
                key={`ellipsis-${pageNumber}`}
                className="px-3 py-1 text-gray-500"
              >
                ...
              </span>
            );
          }

          // Render page number button
          return (
            <button
              key={`page-${pageNumber}`}
              onClick={() => onPageChange(pageNumber)}
              className={`px-3 py-1 rounded-md cursor-pointer min-w-[36px] ${
                currentPage === pageNumber
                  ? 'bg-accent text-white'
                  : 'border hover:bg-gray-100'
              }`}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={currentPage === pageNumber ? 'page' : undefined}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* Next button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md border disabled:opacity-50"
          aria-label="Go to next page"
        >
          <MdOutlineNavigateNext className="w-5 h-5 cursor-pointer" />
        </button>

        {/* Last page button */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 rounded-md border disabled:opacity-50 flex items-center"
          aria-label="Go to last page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            className=" cursor-pointer"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="13 17 18 12 13 7"></polyline>
            <polyline points="6 17 11 12 6 7"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}
