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
    <AnimatePresence>
      {isVisible && (
        <motion.span
          initial={{ y: '0' }}
          animate={{ y: '-48%' }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className={`bg-error text-white px-8 py-1 rounded-2xl text-[12px] absolute ${className}`}
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
