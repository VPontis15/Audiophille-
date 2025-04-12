import { useState, useRef } from 'react';
import FormInput from '../../utils/FormInput';
import { useFetchData } from '../../../custom hooks/useFetchData';
import Select, { StylesConfig } from 'react-select';
import FormRow from '../../utils/FormRow';
import noImageFound from '../../../assets/no-product-image.png';
import FormInputFile from '../../utils/FormInputFile';

// Custom styles for react-select
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

interface Category {
  id?: string;
  _id?: string;
  name?: string;
}

interface Brand {
  id?: string;
  _id?: string;
  name?: string;
}

export default function ProductForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [discountType, setDiscountType] = useState('none');
  const [isOnSale, setIsOnSale] = useState(false);
  const [salePrice, setSalePrice] = useState(0);
  const [saleStartDate, setSaleStartDate] = useState<Date | null>(null);
  const [saleEndDate, setSaleEndDate] = useState<Date | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleDataChange = <
    T extends string | number | boolean | Date | null | File | File[] | string[]
  >(
    e: React.ChangeEvent<HTMLInputElement>,
    fn: React.Dispatch<React.SetStateAction<T>>
  ) => {
    const value =
      e.target.type === 'date' && e.target.value
        ? new Date(e.target.value)
        : e.target.value;
    fn(value as unknown as T);
  };

  const handleImageClick = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useFetchData<Category>('categories', 'categories', { fields: 'id,name' });

  const { data: brandsData, isLoading: isBrandsLoading } = useFetchData<Brand>(
    'brands',
    'brands',
    { fields: 'id,name' }
  );

  // Transform categories data for react-select
  const categoryOptions =
    categoriesData?.data?.map((category: Category) => ({
      label: category.name || '',
      value: category.id || category._id || '',
    })) || [];

  // Transform brands data for react-select
  const brandOptions =
    brandsData?.data?.map((brand: Brand) => ({
      label: brand.name || '',
      value: brand.id || brand._id || '',
    })) || [];

  const discountOptions = [
    {
      label: 'none',
      value: 'none',
    },
    {
      label: 'fixed',
      value: 'fixed',
    },
    {
      label: 'percentage',
      value: 'percentage',
    },
  ];

  return (
    <>
      <form
        className=" max-w-[98%] mx-auto grid grid-cols-[55%_30%] gap-8"
        action=""
      >
        <section className="flex flex-col gap-4 ">
          <div className="bg-slate-50 p-8 rounded-2xl grid gap-6">
            <h2 className="text-xl font-bold">General Information</h2>
            <FormInput
              className="bg-slate-100"
              full
              label="Product title"
              name="title"
              type="text"
              onChange={(e) => handleDataChange(e, setTitle)}
              value={title}
            />
            <FormInput
              full
              className="h-35 bg-slate-100"
              label="Product description"
              name="description"
              type="textarea"
              onChange={(e) => handleDataChange(e, setDescription)}
              value={description}
            />
          </div>
          <div className="bg-slate-50 p-8 rounded-2xl grid gap-6">
            <h2 className="text-xl font-bold">Price and stock options</h2>
            <FormRow>
              <FormInput
                className="bg-slate-100"
                label="Price"
                name="price"
                type="number"
                onChange={(e) => handleDataChange(e, setPrice)}
                value={price}
              />
              <FormInput
                className="bg-slate-100"
                label="Stock"
                name="quantity"
                type="number"
                onChange={(e) => handleDataChange(e, setQuantity)}
                value={quantity}
              />
            </FormRow>
            <div className="flex gap-6 items-end">
              <FormInput
                className="bg-slate-100"
                full
                label="Disount"
                name="discount"
                type="number"
                onChange={(e) => handleDataChange(e, setSalePrice)}
                value={salePrice}
              />
              <Select
                options={discountOptions}
                name="discountType"
                onChange={(selected) =>
                  setDiscountType(selected?.value || 'none')
                }
                value={discountOptions.find(
                  (option: { label: string; value: string }) =>
                    option.value === discountType
                )}
                placeholder="Select discount..."
                isClearable
                className="text-sm w-full bg-slate-100"
                styles={customSelectStyles}
              />{' '}
            </div>
          </div>
        </section>
        <section className="flex flex-col gap-4">
          <div className="bg-slate-50 p-8 rounded-2xl grid gap-6">
            <h2 className="text-xl font-bold">Upload an image</h2>
            <FormInputFile
              label="Product Image"
              name="image"
              type="file"
              value={image}
              onChange={(e) => handleDataChange(e, setImage)}
              className="w-full max-w-full"
              placeholder="Upload main product image"
              defaultPreview={noImageFound}
            />
            <FormInputFile
              label="Product images"
              name="images"
              type="file"
              multiple
              value={images}
              onChange={(e) => handleDataChange(e, setImages)}
            />

            <FormInput
              className="flex items-center"
              label="Is featured"
              name="isFeatured"
              type="checkbox"
              onChange={(e) => handleDataChange(e, setIsFeatured)}
              value={isFeatured}
            />
          </div>
          <div className="bg-slate-50 p-8 rounded-2xl grid gap-6">
            <h2 className="text-xl font-bold">Product options</h2>
            <div className="flex gap-6 items-center">
              <div className="flex flex-col gap-2 w-1/2">
                <label className="text-[12px] font-bold" htmlFor="category">
                  Product category
                </label>
                <Select
                  options={categoryOptions}
                  name="category"
                  onChange={(selected) => setCategory(selected?.value || '')}
                  value={categoryOptions.find(
                    (option: { label: string; value: string }) =>
                      option.value === category
                  )}
                  isLoading={isCategoriesLoading}
                  placeholder="Select category..."
                  isClearable
                  className="text-sm"
                  styles={customSelectStyles}
                />
              </div>

              <div className="flex flex-col gap-2 w-1/2">
                <label className="text-[12px] font-bold" htmlFor="brand">
                  Product brand
                </label>
                <Select
                  options={brandOptions}
                  name="brand"
                  onChange={(selected) => setBrand(selected?.value || '')}
                  value={brandOptions.find(
                    (option: { label: string; value: string }) =>
                      option.value === brand
                  )}
                  isLoading={isBrandsLoading}
                  placeholder="Select brand..."
                  isClearable
                  className="text-sm"
                  styles={customSelectStyles}
                />
              </div>
            </div>
          </div>
        </section>
      </form>
    </>
  );
}
