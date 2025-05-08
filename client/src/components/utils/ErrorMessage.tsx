import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ErrorMessage({
  children,
  className,
  isVisible = true,
}: {
  children: ReactNode;
  className?: string;
  isVisible?: boolean;
}): React.ReactElement {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`bg-red-500 text-white text-sm rounded ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
