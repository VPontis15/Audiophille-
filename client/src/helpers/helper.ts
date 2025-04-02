import { QueryParams } from '../types/Dashboard/types';

export // Function to generate paginated page numbers with ellipsis
const getPageNumbers = (totalPages: number, currentPage: number) => {
  const pageNumbers = [];
  const maxPagesToShow = 5; // Total page buttons to show (excluding first, last, prev, next)

  // Always show first page
  pageNumbers.push(1);

  if (totalPages <= maxPagesToShow) {
    // If we have fewer pages than maxPagesToShow, show all pages
    for (let i = 2; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Calculate range around current page
    const leftSiblingIndex = Math.max(2, currentPage - 1);
    const rightSiblingIndex = Math.min(totalPages - 1, currentPage + 1);

    // Whether to show ellipsis on left and right sides
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (showLeftDots && !showRightDots) {
      // Show more pages on the left
      const leftItemCount = 3;
      for (let i = totalPages - leftItemCount; i <= totalPages - 1; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push(totalPages);
    } else if (!showLeftDots && showRightDots) {
      // Show more pages on the right
      for (let i = 2; i <= 3; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push(-1); // Placeholder for right ellipsis
      pageNumbers.push(totalPages);
    } else if (showLeftDots && showRightDots) {
      // Show ellipsis on both sides
      pageNumbers.push(-1); // Placeholder for left ellipsis
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push(-2); // Placeholder for right ellipsis (different value to avoid React key conflicts)
      pageNumbers.push(totalPages);
    } else {
      // Show all pages in between
      for (let i = 2; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    }
  }

  return pageNumbers;
};

export const getSortField = (fieldName: string) => {
  // Add mappings for any fields that have different names in API vs UI
  const fieldMappings: Record<string, string> = {
    // Add mappings if needed
    // 'uiFieldName': 'apiFieldName',
  };

  return fieldMappings[fieldName] || fieldName;
};

export // Function to check if a column is being sorted and in what direction
const getSortDirection = (columnLabel: string, sortFields: QueryParams[]) => {
  // Use the key property if available, otherwise use the label
  const sortInfo = sortFields.find(
    (sort) => sort.field === getSortField(columnLabel)
  );
  return sortInfo ? sortInfo.direction : null;
};

// Function to handle sort clicking on a column header
export const handleSort = (
  columnLabel: string,
  sortFields: QueryParams[],
  searchParams: URLSearchParams,
  setSearchParams: (params: URLSearchParams) => void,
  sortable: boolean
) => {
  if (!sortable) return;

  // Use the appropriate field name for sorting
  const sortFieldName = getSortField(columnLabel);

  // Get current sort fields
  const newSortFields = [...sortFields];

  // Find if this column is already being sorted
  const existingIndex = newSortFields.findIndex(
    (sort) => sort.field === sortFieldName
  );

  if (existingIndex >= 0) {
    // Column is already being sorted
    const currentDirection = newSortFields[existingIndex].direction;

    if (currentDirection === 'asc') {
      // Change to descending
      newSortFields[existingIndex].direction = 'desc';
    } else {
      // Remove this column from sort
      newSortFields.splice(existingIndex, 1);
    }
  } else {
    // Add this column as a new sort field (ascending)
    newSortFields.push({ field: sortFieldName, direction: 'asc' });
  }

  // Build the new sort parameter
  const newSort = newSortFields
    .map((sort) => (sort.direction === 'desc' ? `-${sort.field}` : sort.field))
    .join(',');

  // Update URL parameters
  const params = new URLSearchParams(searchParams);

  if (newSort) {
    params.set('sort', newSort);
  } else {
    params.delete('sort');
  }

  // Reset to first page when changing sort
  params.set('page', '1');

  setSearchParams(params);
};
