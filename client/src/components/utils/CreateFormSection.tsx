export default function CreateFormSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): React.ReactElement {
  return (
    <section className={`bg-slate-50 p-8 rounded-2xl grid gap-6 ${className}`}>
      {children}
    </section>
  );
}
