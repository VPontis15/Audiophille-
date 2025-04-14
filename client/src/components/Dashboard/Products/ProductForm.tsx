import { useState, useRef } from 'react';
import FormInput from '../../utils/FormInput';
import { useFetchData } from '../../../custom hooks/useFetchData';
import Select, { StylesConfig } from 'react-select';
import FormRow from '../../utils/FormRow';
import noImageFound from '../../../assets/no-product-image.png';
import FormInputFile from '../../utils/FormInputFile';
import CreateFormSection from '../../utils/CreateFormSection';
import CreateFormColumn from '../../utils/CreateFormColumn';
import Button from '../../utils/Button';
import API from '../../../api/API';

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
  const [discount, setDiscount] = useState(0);

  // Product details state
  const [sku, setSku] = useState('');
  const [weight, setWeight] = useState('');
  const [frequencyResponse, setFrequencyResponse] = useState('');
  const [impedance, setImpedance] = useState('');
  const [connectivity, setConnectivity] = useState('');
  const [batteryLife, setBatteryLife] = useState('');
  const [color, setColor] = useState('');
  const [warranty, setWarranty] = useState('');

  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleDataChange = <
    T extends string | number | boolean | Date | null | File | File[] | string[]
  >(
    e: React.ChangeEvent<HTMLInputElement>,
    fn: React.Dispatch<React.SetStateAction<T>>
  ) => {
    const value =
      e.target.type === 'checkbox'
        ? e.target.checked
        : e.target.type === 'date' && e.target.value
        ? new Date(e.target.value)
        : e.target.value;
    fn(value as unknown as T);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fn:
      | React.Dispatch<React.SetStateAction<File | null>>
      | React.Dispatch<React.SetStateAction<File[]>>
  ) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      if (files.length === 1 && fn === setImage) {
        fn(fileArray[0]);
      } else {
        (fn as React.Dispatch<React.SetStateAction<File[]>>)(fileArray);
      }
    }
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

  const onHandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Update isOnSale based on discount and discountType
    const productIsOnSale = discount > 0 && discountType !== 'none';

    const productData = {
      name: title || 'Untitled Product', // Provide default name
      description: description || 'No description provided', // Provide default description
      price: price || 0,
      quantity: quantity || 0,
      categoryId: parseInt(category) || 1, // Ensure category ID is sent as integer with default
      brandId: parseInt(brand) || 1, // Ensure brand ID is sent as integer with default
      tags: tags || [],
      isFeatured: isFeatured || false,
      discountType: discountType || 'none',
      isOnSale: productIsOnSale,
      discount: discount || 0,
      sku: sku || '',
      weight: weight || '',
      frequencyResponse: frequencyResponse || '',
      impedance: impedance || '',
      connectivity: connectivity || '',
      batteryLife: batteryLife || '',
      color: color || '',
      warranty: warranty || '',
      status: 'published', // Default status
      gallery: '[]', // Default empty gallery
      rating: 0, // Default rating
      collection: 'default', // Default collection
    };

    console.log('Product Data:', productData);
    const api = new API();
    try {
      const response = await api.createOne('products', productData);
      console.log('Product created successfully:', response);
    } catch (error) {
      console.error('Error creating product:', error);
      // Better error handling
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    }
  };

  return (
    <>
      <form
        onSubmit={onHandleSubmit}
        encType="multipart/form-data"
        className="  mx-auto grid grid-cols-[65%_30%] gap-8"
        action=""
      >
        <CreateFormColumn>
          <CreateFormSection>
            <h2 className="text-xl font-bold">General Information</h2>
            <FormInput
              className="bg-slate-100"
              full
              label="Product title"
              name="title"
              required
              placeholder="e.g. Wireless Headphones"
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
          </CreateFormSection>

          <CreateFormSection>
            <h2 className="text-xl font-bold">Product Details</h2>
            <FormRow>
              <FormInput
                className="bg-slate-100"
                label="SKU"
                name="sku"
                type="text"
                onChange={(e) => handleDataChange(e, setSku)}
                value={sku}
              />
              <FormInput
                className="bg-slate-100"
                label="Weight"
                name="weight"
                type="text"
                placeholder="e.g. 250g"
                onChange={(e) => handleDataChange(e, setWeight)}
                value={weight}
              />
            </FormRow>
            <FormRow>
              <FormInput
                className="bg-slate-100"
                label="Frequency Response"
                name="frequencyResponse"
                type="text"
                placeholder="e.g. 20Hz-20kHz"
                onChange={(e) => handleDataChange(e, setFrequencyResponse)}
                value={frequencyResponse}
              />
              <FormInput
                className="bg-slate-100"
                label="Color"
                name="color"
                type="text"
                onChange={(e) => handleDataChange(e, setColor)}
                value={color}
              />
            </FormRow>
            <FormRow>
              <FormInput
                className="bg-slate-100"
                label="Connectivity"
                name="connectivity"
                type="text"
                placeholder="e.g. Bluetooth 5.0, Wired"
                onChange={(e) => handleDataChange(e, setConnectivity)}
                value={connectivity}
              />
              <FormInput
                className="bg-slate-100"
                label="Impedance"
                name="impedance"
                type="text"
                placeholder="e.g. 32 Ohms"
                onChange={(e) => handleDataChange(e, setImpedance)}
                value={impedance}
              />
            </FormRow>
            <FormRow>
              <FormInput
                className="bg-slate-100"
                label="Battery Life"
                name="batteryLife"
                type="text"
                placeholder="e.g. 24 hours"
                onChange={(e) => handleDataChange(e, setBatteryLife)}
                value={batteryLife}
              />
              <FormInput
                className="bg-slate-100"
                label="Warranty"
                name="warranty"
                type="text"
                placeholder="e.g. 2 years"
                onChange={(e) => handleDataChange(e, setWarranty)}
                value={warranty}
              />
            </FormRow>
          </CreateFormSection>

          <CreateFormSection>
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
                onChange={(e) => handleDataChange(e, setDiscount)}
                value={discount}
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
          </CreateFormSection>
        </CreateFormColumn>
        <CreateFormColumn>
          <CreateFormSection>
            <h2 className="text-xl font-bold">Upload an image</h2>
            <FormInputFile
              full
              label="Product Image"
              name="image"
              type="file"
              value={image}
              onChange={(e) => handleFileChange(e, setImage)}
              className="w-full max-w-full"
              placeholder="Upload main product image"
              defaultPreview={noImageFound}
            />
            <FormInputFile
              full
              label="Product images"
              name="images"
              type="file"
              multiple
              value={images}
              onChange={(e) => handleFileChange(e, setImages)}
            />

            <FormInput
              className="flex items-center"
              label="Is featured"
              name="isFeatured"
              type="checkbox"
              onChange={(e) => handleDataChange(e, setIsFeatured)}
              checked={isFeatured}
              value={isFeatured}
            />
          </CreateFormSection>
          <CreateFormSection>
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
            <Button primary>Publish</Button>
          </CreateFormSection>
        </CreateFormColumn>
      </form>
    </>
  );
}
