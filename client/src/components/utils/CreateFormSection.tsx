import { motion } from 'framer-motion';

export default function CreateFormSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): React.ReactElement {
  return (
    <motion.section
      initial={{ opacity: 0, y: '-80%' }}
      animate={{ opacity: 1, y: '0%' }}
      exit={{ opacity: 0, y: '-80%' }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={`bg-slate-50 p-8 rounded-2xl grid gap-6 ${className}`}
    >
      {children}
    </motion.section>
  );
}
