export default function SelectInput({
  name,
  options,
  value,
  onChange,
  className,
  ...rest
}: {
  name: string;
  options: { label: string; value: string }[];
  value: string;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}): React.ReactElement {
  return (
    <select
      className={`border border-text/30 rounded-sm px-2 py-0.5 text-center ${className}`}
      {...rest}
      onChange={onChange}
      name={name}
      value={value}
      id=""
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
