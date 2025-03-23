import { ReactNode } from 'react';

export default function ErrorMessage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): React.ReactElement {
  return (
    <span className={`text-error text-[12px]  ${className}`}>{children}</span>
  );
}
