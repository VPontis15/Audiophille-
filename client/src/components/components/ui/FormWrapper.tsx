import Button from '../../utils/Button';

export default function FormWrapper({
  children,
  title,
  description,
  onSubmit,
  className,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}): React.ReactElement {
  return (
    <form
      className={`${className} rounded-lg p-6`}
      onSubmit={(e) => {
        if (onSubmit) {
          e.preventDefault();
          onSubmit(e);
        }
      }}
    >
      {title && <h1 className="text-2xl font-bold">{title}</h1>}
      {description && <p className="text-gray-500">{description}</p>}
      {children}
      <Button primary>Add</Button>
    </form>
  );
}
