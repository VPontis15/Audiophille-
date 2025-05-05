import { ReactNode, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Modal({
  children,
  returnPath,
  preserveState = true,
  className = '',
}: {
  children: ReactNode;
  className?: string;
  returnPath?: string;
  preserveState?: boolean;
}): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();

  const closeModal = useCallback(() => {
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
  }, [navigate, returnPath, location.search, preserveState]);

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
  }, [closeModal]);

  return (
    <motion.div
      className="fixed modal inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={closeModal} // Close when clicking the overlay
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        key="box"
        className={`bg-white rounded-lg shadow-xl relative max-h-[90vh] overflow-auto ${className}`}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside dialog from closing
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
