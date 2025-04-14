export default function CreateFormColumn({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <section className="flex flex-col gap-4 ">{children}</section>;
}
