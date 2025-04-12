export interface FormInputProps {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  value: string | number | boolean | Date | null | File | File[] | string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  full?: boolean;
  checked?: boolean;
  onBlur?: (e: string | number | void) => void;
  className?: string;
}

export interface FormErrors {
  [key: string]: string;
}
