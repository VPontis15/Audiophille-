import { ReactNode } from 'react';

export default function DashboardSectionLayout({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
    <div className="  py-4 min-h-screen  overflow-y-auto ">
      <main className=" flex flex-col">{children}</main>
    </div>
  );
}
