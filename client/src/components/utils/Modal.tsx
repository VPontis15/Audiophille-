import { ReactNode, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Modal({
  children,
  returnPath,
  preserveState = true,
}: {
  children: ReactNode;
  returnPath?: string;
  preserveState?: boolean;
}): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();

  const closeModal = () => {
    if (returnPath) {
      // Get current search parameters
      const currentSearchParams = new URLSearchParams(location.search);

      // Extract list-specific query parameters if needed
      // For example, if your list uses page, limit, search params:
      const page = currentSearchParams.get('page');
      const limit = currentSearchParams.get('limit');
      const search = currentSearchParams.get('search');

      // Build a new URL with the return path and preserved query parameters
      let finalPath = returnPath;

      if (preserveState && (page || limit || search)) {
        const params = new URLSearchParams();
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        if (search) params.append('search', search);

        finalPath = `${returnPath}?${params.toString()}`;
      } else if (preserveState && location.search) {
        // If we want to preserve all current query params
        finalPath = `${returnPath}${location.search}`;
      }

      navigate(finalPath);
    } else {
      // If no returnPath specified, just go back
      navigate(-1);
    }
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [navigate, returnPath, location.search, preserveState, closeModal]);

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={closeModal} // Close when clicking the overlay
    >
      <div
        className="dialog relative max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside dialog from closing
      >
        {children}
      </div>
    </div>
  );
}
