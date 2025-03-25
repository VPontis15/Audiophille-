import { ReactNode } from 'react';

export default function CartModal({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
    <>
      <div className="fixed overlay inset-0 bg-black/30 bg-opacity-50 z-1"></div>
      <section
        id="cart-modal"
        className="cart-modal rounded-tl-lg rounded-bl-lg bg-white grid gap-6 min-w-120   !fixed right-0 top-20 m-auto z-99 p-8"
      >
        {children}
      </section>
    </>
  );
}
