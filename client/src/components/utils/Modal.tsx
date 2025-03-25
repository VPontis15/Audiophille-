import { ReactNode } from 'react';

export default function Modal({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40 grid place-items-center">
        <dialog className=" z-50  mx-auto rounded-lg " open>
          {children}
        </dialog>
      </div>
    </>
  );
}
