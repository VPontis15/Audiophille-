import Select, { StylesConfig } from 'react-select';

interface SelectInputProps {
  options: { label: string; value: string }[];
  name: string;
  setValue: (value: string) => void;
  isValueLoading?: boolean;
  label?: string;
  placeholder?: string;
  value: string | number;
}

const customSelectStyles: StylesConfig = {
  control: (provided, state) => ({
    ...provided,

    borderColor: state.isFocused ? '#d87d4a' : provided.borderColor,
    boxShadow: state.isFocused ? '0 0 0 1px #d87d4a' : provided.boxShadow,
    '&:hover': {
      borderColor: '#d87d4a',
    },
    backgroundColor: '#f1f5f9',
    paddingBlock: '.25rem',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#d87d4a'
      : state.isFocused
      ? 'rgba(216, 125, 74, 0.1)'
      : provided.backgroundColor,
    color: state.isSelected ? 'white' : provided.color,
    '&:hover': {
      backgroundColor: state.isSelected ? '#d87d4a' : 'rgba(216, 125, 74, 0.1)',
      cursor: 'pointer',
    },
  }),
  input: (provided) => ({
    ...provided,
    color: '#000',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#000',
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: '#d87d4a',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: '#d87d4a',
    '&:hover': {
      color: '#c16c3a',
    },
  }),
};

export default function SelectInput({
  options,
  value,
  label,
  name,
  placeholder,
  setValue,
  isValueLoading,
}: SelectInputProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-2 w-1/2">
      <span className="text-[12px] font-bold">{label}</span>
      <Select
        options={options}
        name={name}
        onChange={(newValue) => {
          const selected = newValue as { label: string; value: string } | null;
          setValue(selected?.value || '');
        }}
        value={options.find(
          (option: { label: string; value: string }) => option.value === value
        )}
        isLoading={isValueLoading}
        placeholder={placeholder}
        isClearable
        className="text-sm"
        styles={customSelectStyles}
      />
    </div>
  );
}
