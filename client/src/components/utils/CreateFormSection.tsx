export default function CreateFormSection({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="bg-slate-50 p-8 rounded-2xl grid gap-6">{children}</div>
  );
}
