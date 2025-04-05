export default function AdminContentWrapper({
  children,
  heading,
  description,
}: {
  children: React.ReactNode;
  heading: string;
  description?: string;
}): React.ReactElement {
  return (
    <section className="p-4 space-y-4 ">
      <div className="flex flex-col space-y-2">
        <h1 className="text-h3 font-bold mb-6">{heading}</h1>
        {description && <p className="text-gray-500">{description}</p>}
      </div>
      {children}
    </section>
  );
}
