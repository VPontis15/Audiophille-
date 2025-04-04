import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Modal({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  const navigate = useNavigate();

  const closeModal = () => {
    // Go back to the previous page
    navigate(-1);
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const dialog = document.querySelector('.dialog');
      if (!dialog) return;
      if (dialog && !dialog.contains(event.target as Node)) {
        closeModal();
      }
    };
    document.body.addEventListener('click', handleClickOutside);

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="dialog relative max-h-[90vh] overflow-auto">
        {/* Pass closeModal to children via props or context if needed */}
        {children}
      </div>
    </div>
  );
}
