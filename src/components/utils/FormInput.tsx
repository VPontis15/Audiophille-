import { FormInputProps } from '../../types/formType';

export default function FormInput({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  required,
  full = false,
  ...rest
}: FormInputProps): React.ReactElement {
  if (type !== 'radio') {
    return (
      <div className={`flex flex-col gap-2.5  ${full ? 'w-full' : 'w-1/2'}`}>
        <label className="text-[12px] font-bold" htmlFor={name}>
          {label}
        </label>
        <input
          className="font-bold placeholder:opacity-60 placeholder:text-[14px] border border-border py-2.5 pl-6 rounded-md focus-visible:outline-none focus-visible:ring focus-visible:ring-accent "
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          {...rest}
        />
      </div>
    );
  } else {
    return (
      <div
        className={`flex border border-border rounded-xl w-full  gap-2.5 p-4 items-center`}
      >
        <input
          className="checked:accent-accent cursor-pointer placeholder:opacity-50 placeholder:text-[14px] w-5 h-5 border  border-border py-1.5 pl-6 rounded-md focus-visible:outline-none focus-visible:ring focus-visible:ring-accent "
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          {...rest}
        />
        <label className="text-[12px] font-bold " htmlFor={name}>
          {label}
        </label>
      </div>
    );
  }
}
