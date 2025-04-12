import { useState, ChangeEvent, useRef, useEffect } from 'react';
import { FormErrors, FormInputProps } from '../../types/formType';
import ErrorMessage from './ErrorMessage';
import noImageFound from '../../assets/no-product-image.png';

interface FormInputFileProps extends FormInputProps {
  multiple?: boolean;
  defaultPreview?: string;
}

export default function FormInputFile({
  label,
  name,
  placeholder = 'Choose a file',
  value,
  onChange,
  required = false,
  full = false,
  className = '',
  multiple = false,
  defaultPreview = '',
  ...rest
}: FormInputFileProps): React.ReactElement {
  const [errors, setErrors] = useState<FormErrors>({});
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Call the parent onChange handler
      onChange(e);

      // Create preview URLs for image files
      const newPreviews: string[] = [];

      Array.from(e.target.files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          const fileUrl = URL.createObjectURL(file);
          newPreviews.push(fileUrl);
        }
      });

      // Clean up any existing preview URLs
      previews.forEach((url) => {
        if (url !== defaultPreview && !url.includes('no-product-image.png')) {
          URL.revokeObjectURL(url);
        }
      });

      // Set new previews
      setPreviews(newPreviews);
    }
  };

  const showErrorOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const files = e.target.files;

    if (required && (!files || files.length === 0)) {
      setErrors((prev) => ({
        ...prev,
        [name]: 'A file is required',
      }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleClickBox = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Clean up any created object URLs when component unmounts
  useEffect(() => {
    return () => {
      previews.forEach((url) => {
        if (url !== defaultPreview && !url.includes('no-product-image.png')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previews, defaultPreview]);

  // Get file names for display
  const getFileNames = (): string[] => {
    if (value instanceof File) {
      return [value.name];
    } else if (Array.isArray(value) && value.length > 0) {
      return value
        .map((file) => {
          if (file instanceof File) {
            return file.name;
          }
          return '';
        })
        .filter(Boolean);
    }
    return [];
  };

  const fileNames = getFileNames();
  const displayText = multiple
    ? fileNames.length > 0
      ? `${fileNames.length} files selected`
      : placeholder
    : fileNames[0] || placeholder;

  // Use defaultPreview or fallback to noImageFound if no preview is available
  const hasCustomPreview = previews.length > 0;
  const showDefaultPreview = !hasCustomPreview && !multiple;
  const defaultPreviewSrc = defaultPreview || noImageFound;

  return (
    <div
      className={`flex flex-col gap-2.5 w-full relative ${
        full ? 'md:w-full' : 'md:w-1/2'
      } `}
    >
      <label className="text-[12px] font-bold" htmlFor={name}>
        {label}
      </label>

      <div
        className={`relative border border-dashed border-border rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
          errors[name] ? 'bg-red-100 border-red-400' : ''
        } ${className}`}
        onClick={handleClickBox}
      >
        <input
          ref={fileInputRef}
          className="hidden"
          id={name}
          name={name}
          type="file"
          onChange={handleFileChange}
          onBlur={showErrorOnBlur}
          required={required}
          multiple={multiple}
          {...rest}
        />

        {hasCustomPreview ? (
          <div className="flex flex-col items-center">
            {multiple && previews.length > 1 ? (
              <div className="flex flex-wrap gap-2 justify-center mb-2">
                {previews.map((previewUrl, index) => (
                  <div key={index} className="w-20 h-20 relative">
                    <img
                      src={previewUrl}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <img
                src={previews[0]}
                alt="File preview"
                className="max-h-40 max-w-full mb-2 rounded object-cover"
              />
            )}
            <p className="text-sm font-medium break-all">{displayText}</p>
          </div>
        ) : showDefaultPreview ? (
          <div className="flex flex-col items-center">
            <img
              src={defaultPreviewSrc}
              alt="Default preview"
              className="max-h-40 max-w-full mb-2 rounded object-cover"
            />
            <p className="text-sm font-medium break-all">{displayText}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center py-4">
            <svg
              className="w-10 h-10 mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm text-gray-500">{displayText}</p>
            <p className="text-xs text-gray-400 mt-1">
              Click to browse{multiple ? ' (multiple files allowed)' : ''}
            </p>
          </div>
        )}
      </div>

      {errors[name] && (
        <ErrorMessage className="absolute -bottom-5.5">
          {errors[name]}
        </ErrorMessage>
      )}
    </div>
  );
}
