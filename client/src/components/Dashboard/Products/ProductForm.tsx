import { useState, useRef, useEffect } from 'react';
import FormInput from '../../utils/FormInput';
import { useFetchData } from '../../../custom hooks/useFetchData';
import FormRow from '../../utils/FormRow';
import noImageFound from '../../../assets/no-product-image.png';
import FormInputFile from '../../utils/FormInputFile';
import CreateFormSection from '../../utils/CreateFormSection';
import CreateFormColumn from '../../utils/CreateFormColumn';
import Button from '../../utils/Button';
import API from '../../../api/API';
import { toast } from 'react-toastify';
import SelectInput from '../../utils/SelectInput';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

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

export default function ProductForm({}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [gallery, setGallery] = useState<File[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [discountType, setDiscountType] = useState('none');
  const [isOnSale, setIsOnSale] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [status, setStatus] = useState('published');

  // Product details state
  const [sku, setSku] = useState('');
  const [weight, setWeight] = useState('');
  const [frequencyResponse, setFrequencyResponse] = useState('');
  const [impedance, setImpedance] = useState('');
  const [connectivity, setConnectivity] = useState('');
  const [batteryLife, setBatteryLife] = useState('');
  const [color, setColor] = useState('');
  const [warranty, setWarranty] = useState('');
  const { slug } = useParams<{ slug: string }>();
  const [productToUpdate, setProductToUpdate] = useState<any>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const api = new API();

  const { data: productData, isLoading: isProductLoading } = useQuery<{
    product?: any;
  }>({
    queryKey: ['product'],
    queryFn: async (): Promise<{ product?: any } | null> => {
      try {
        const response = await api.fetchOne('products', slug || '');
        return response as { product?: any } | null;
      } catch (error) {
        console.error('Error fetching products:', error);
        return null;
      }
    },
    enabled: !!slug,
  });
  const product = productData?.product;

  useEffect(() => {
    if (product) {
      setProductToUpdate(product);
    }
  }, [product]);

  // Set state values when editing a product
  useEffect(() => {
    if (productToUpdate) {
      setTitle(productToUpdate.name || '');
      setDescription(productToUpdate.description || '');
      setPrice(productToUpdate.price ?? 0);
      setQuantity(productToUpdate.quantity ?? 0);
      setCategory(
        productToUpdate.categoryId?.toString?.() ||
          productToUpdate.category?.toString?.() ||
          ''
      );
      setBrand(
        productToUpdate.brandId?.toString?.() ||
          productToUpdate.brand?.toString?.() ||
          ''
      );
      setIsFeatured(!!productToUpdate.isFeatured);
      setDiscountType(productToUpdate.discountType || 'none');
      setIsOnSale(!!productToUpdate.isOnSale);
      setDiscount(productToUpdate.discount ?? 0);
      setSku(productToUpdate.sku || '');
      setWeight(productToUpdate.weight || '');
      setFrequencyResponse(productToUpdate.frequencyResponse || '');
      setImpedance(productToUpdate.impedance || '');
      setConnectivity(productToUpdate.connectivity || '');
      setBatteryLife(productToUpdate.batteryLife || '');
      setColor(productToUpdate.color || '');
      setWarranty(productToUpdate.warranty || '');
      setStatus(productToUpdate.status || 'published');

      // If you want to handle images/galleries, add logic here as well
    }
  }, [productToUpdate]);

  const handleDataChange = <
    T extends string | number | boolean | Date | null | File | File[] | string[]
  >(
    e: React.ChangeEvent<HTMLInputElement>,
    fn: React.Dispatch<React.SetStateAction<T>>
  ) => {
    const value =
      e.target.type === 'checkbox'
        ? e.target.checked
        : e.target.type === 'number'
        ? e.target.value === ''
          ? 0
          : Number(e.target.value)
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

  const statusOptions = [
    {
      label: 'published',
      value: 'published',
    },
    {
      label: 'draft',
      value: 'draft',
    },
  ];

  const onHandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Update isOnSale based on discount and discountType
    const productIsOnSale = discount > 0 && discountType !== 'none';

    const productData = {
      name: title, // Provide default name
      description: description, // Provide default description
      price: price || 0,
      quantity: Number.isInteger(quantity) ? quantity : Math.floor(quantity),
      categoryId: parseInt(category) || 1, // Ensure category ID is sent as integer with default
      brandId: parseInt(brand) || 1, // Ensure brand ID is sent as integer with default
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
      status, // Default status
      gallery: '[]', // Default empty gallery
      rating: 0, // Default rating
      collection: 'default', // Default collection
    };

    try {
      const response = await api.createOne('products', productData);
      toast.success('Product created successfully!');
    } catch (error: unknown) {
      console.error('Error creating product:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const errorResponse = error.response as { data: { message: string } };
        console.error('Response data:', errorResponse.data);
        toast.error(`Error: ${errorResponse.data.message}`);
      }
    }
  };

  const featuredImage =
    typeof productToUpdate?.featuredImage === 'string'
      ? JSON.parse(productToUpdate.featuredImage)
      : productToUpdate?.featuredImage;

  const galleryImages =
    typeof productToUpdate?.gallery === 'string'
      ? JSON.parse(productToUpdate.gallery)
      : productToUpdate?.gallery;

  // Extract gallery image URLs (assuming array of objects with .desktop.url)
  const galleryPreviewUrls = Array.isArray(galleryImages)
    ? galleryImages.map((img) => img?.desktop?.url).filter(Boolean)
    : [];

  console.log(galleryImages);

  return (
    <>
      <form
        onSubmit={onHandleSubmit}
        encType="multipart/form-data"
        className="  mx-auto grid grid-cols-[60%_35%] gap-8 mb-22"
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
              <SelectInput
                options={discountOptions}
                name="discountType"
                placeholder="Select discount type"
                setValue={setDiscountType}
                value={discountType}
                label="Discount type"
              />
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
              defaultPreview={featuredImage?.desktop?.url || noImageFound}
            />
            <FormInputFile
              full
              label="Product images"
              name="images"
              type="file"
              multiple
              value={gallery}
              onChange={(e) => handleFileChange(e, setGallery)}
              defaultPreviews={galleryPreviewUrls}
            />
            <div className="flex items-end gap-2">
              <FormInput
                className="flex capitalize items-center"
                label="Is featured"
                name="isFeatured"
                type="checkbox"
                onChange={(e) => handleDataChange(e, setIsFeatured)}
                checked={isFeatured}
                value={isFeatured}
              />
              <SelectInput
                options={statusOptions}
                name="status"
                placeholder="Select product status"
                setValue={setStatus}
                value={status}
                label="Select product status"
              />
            </div>
          </CreateFormSection>
          <CreateFormSection>
            <h2 className="text-xl font-bold">Product options</h2>
            <div className="flex gap-4 items-end">
              <SelectInput
                options={categoryOptions}
                name="category"
                placeholder="Select product category"
                setValue={setCategory}
                value={category}
                label="Product category"
                isValueLoading={isCategoriesLoading}
              />

              <SelectInput
                options={brandOptions}
                name="brand"
                placeholder="Select product brand"
                setValue={setBrand}
                value={brand}
                label="Product brand"
                isValueLoading={isBrandsLoading}
              />
            </div>
            <Button className="mt-8" primary>
              Publish
            </Button>
          </CreateFormSection>
        </CreateFormColumn>
      </form>
    </>
  );
}
