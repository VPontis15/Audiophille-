import { ReactNode } from 'react';

export default function FormRow({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return <div className="flex gap-4 mb-6 ">{children}</div>;
}
