import { useState, ChangeEvent } from 'react';
import { FormErrors, FormInputProps } from '../../types/formType';
import ErrorMessage from './ErrorMessage';

export default function FormInput({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  full = false,
  className = '',
  ...rest
}: FormInputProps): React.ReactElement {
  const [errors, setErrors] = useState<FormErrors>({});

  const showErrorOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'name':
        if (!value) {
          setErrors((prev) => ({
            ...prev,
            [name]: 'Your name is required',
          }));
        } else if (value.length && value.length < 3) {
          setErrors((prev) => ({
            ...prev,
            [name]: 'The name has to be at least 3 characters long',
          }));
        } else {
          setErrors((prev) => ({ ...prev, [name]: '' }));
        }
        break;
      case 'email':
        if (!value) {
          setErrors((prev) => ({
            ...prev,
            [name]: 'Your email is required',
          }));
        } else if (
          value.length &&
          !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value)
        ) {
          setErrors((prev) => ({
            ...prev,
            [name]: 'Please enter a valid email address',
          }));
        } else {
          setErrors((prev) => ({ ...prev, [name]: '' }));
        }
        break;
      case 'phone':
        if (!value) {
          setErrors((prev) => ({
            ...prev,
            [name]: 'This field is required',
          }));
        } else if (value.length && value.length < 10) {
          setErrors((prev) => ({
            ...prev,
            [name]: 'The phone number has to be at least 10 characters long',
          }));
        } else {
          setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    }
  };
  if (type === 'textarea') {
    return (
      <div
        className={`flex flex-col gap-2.5 w-full relative  ${
          full ? 'md:w-full' : 'md:w-1/2'
        } `}
      >
        <label className="text-[12px] font-bold" htmlFor={name}>
          {label}
        </label>
        <textarea
          className={`font-bold placeholder:opacity-60 placeholder:text-[14px] border border-border py-2.5 pl-6 rounded-md focus-visible:outline-none focus-visible:ring focus-visible:ring-accent ${className} ${
            errors[name]
              ? 'bg-red-100 border-red-400 focus-visible:ring-red-400'
              : null
          } `}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value !== null && value !== undefined ? String(value) : ''}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e as any)}
          required={required}
          {...rest}
          onBlur={(e) => showErrorOnBlur(e)}
        />
        {errors[name] && (
          <ErrorMessage className="absolute -bottom-5.5">
            {errors[name]}
          </ErrorMessage>
        )}
      </div>
    );
  }
  if (type === 'checkbox') {
    return (
      <div
        className={`flex  rounded-xl   gap-2.5 p-4 items-center ${className}`}
      >
        <input
          className="checked:accent-accent cursor-pointer placeholder:opacity-50 placeholder:text-[14px] min-w-5 min-h-5 border  border-border py-1.5 pl-6 rounded-md focus-visible:outline-none focus-visible:ring focus-visible:ring-accent "
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
        <label className="text-[14px] font-bold " htmlFor={name}>
          {label}
        </label>
      </div>
    );
  }
  if (type !== 'radio') {
    return (
      <div
        className={`flex flex-col gap-2.5 w-full relative  ${
          full ? 'md:w-full' : 'md:w-1/2'
        } `}
      >
        <label className="text-[12px] font-bold" htmlFor={name}>
          {label}
        </label>
        <input
          className={`font-bold placeholder:opacity-60 placeholder:text-[14px] border border-border py-2.5 pl-6 rounded-md focus-visible:outline-none focus-visible:ring focus-visible:ring-accent ${className} ${
            errors[name]
              ? 'bg-red-100 border-red-400 focus-visible:ring-red-400'
              : null
          } `}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value ?? ''}
          onChange={onChange}
          required={required}
          {...rest}
          onBlur={(e) => showErrorOnBlur(e)}
        />
        {errors[name] && (
          <ErrorMessage className="absolute -bottom-5.5">
            {errors[name]}
          </ErrorMessage>
        )}
      </div>
    );
  } else {
    return (
      <div
        className={`flex border border-border rounded-xl   gap-2.5 p-4 items-center ${className}`}
      >
        <input
          className="checked:accent-accent cursor-pointer placeholder:opacity-50 placeholder:text-[14px] min-w-5 min-h-5 border  border-border py-1.5 pl-6 rounded-md focus-visible:outline-none focus-visible:ring focus-visible:ring-accent "
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
        <label className="text-[12px] font-bold " htmlFor={name}>
          {label}
        </label>
      </div>
    );
  }
}
