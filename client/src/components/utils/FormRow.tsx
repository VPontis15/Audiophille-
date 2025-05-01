import { ReactNode } from 'react';

export default function FormRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): React.ReactElement {
  return (
    <div className={`flex flex-col md:flex-row gap-4 mb-6 ${className}`}>
      {children}
    </div>
  );
}
