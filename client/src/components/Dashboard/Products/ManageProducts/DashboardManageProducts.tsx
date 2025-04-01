import Button from '../../../utils/Button';
import Table from '../../../utils/Table';
import { SlOptionsVertical } from 'react-icons/sl';

export default function DashboardManageProducts(): React.ReactElement {
  const data = [
    {
      id: 1,
      status: 'published',
      label: 'Product 1',
      quantity: 10,
      price: 100,
      brand: 'Brand B',
      category: 'Category C',
    },
    {
      id: 2,
      status: 'draft',
      label: 'Product 2',
      quantity: 20,
      price: 200,
      brand: 'Brand A',
      category: 'Category A',
    },
    {
      id: 3,
      status: 'published',
      label: 'Product 3',
      quantity: 30,
      price: 300,
      brand: 'Brand C',
      category: 'Category B',
    },
    {
      id: 3,
      status: 'published',
      label: 'Product 3',
      quantity: 30,
      price: 300,
      brand: 'Brand C',
      category: 'Category B',
    },
    {
      id: 3,
      status: 'published',
      label: 'Product 3',
      quantity: 30,
      price: 300,
      brand: 'Brand C',
      category: 'Category B',
    },
    {
      id: 3,
      status: 'published',
      label: 'Product 3',
      quantity: 30,
      price: 300,
      brand: 'Brand C',
      category: 'Category B',
    },
    {
      id: 3,
      status: 'published',
      label: 'Product 3',
      quantity: 30,
      price: 300,
      brand: 'Brand C',
      category: 'Category B',
    },
    {
      id: 3,
      status: 'published',
      label: 'Product 3',
      quantity: 30,
      price: 300,
      brand: 'Brand C',
      category: 'Category B',
    },
    {
      id: 3,
      status: 'published',
      label: 'Product 3',
      quantity: 30,
      price: 300,
      brand: 'Brand C',
      category: 'Category B',
    },
    {
      id: 3,
      status: 'published',
      label: 'Product 3',
      quantity: 30,
      price: 300,
      brand: 'Brand C',
      category: 'Category B',
    },
    {
      id: 3,
      status: 'published',
      label: 'Product 3',
      quantity: 30,
      price: 300,
      brand: 'Brand C',
      category: 'Category B',
    },
    {
      id: 3,
      status: 'published',
      label: 'Product 3',
      quantity: 30,
      price: 300,
      brand: 'Brand C',
      category: 'Category B',
    },
    {
      id: 3,
      status: 'published',
      label: 'Product 3',
      quantity: 30,
      price: 300,
      brand: 'Brand C',
      category: 'Category B',
    },
    {
      id: 3,
      status: 'published',
      label: 'Product 3',
      quantity: 30,
      price: 300,
      brand: 'Brand C',
      category: 'Category B',
    },
    {
      id: 3,
      status: 'published',
      label: 'Product 3',
      quantity: 30,
      price: 300,
      brand: 'Brand C',
      category: 'Category B',
    },
    // Keep other products...
  ];

  const keyfn = (item: unknown) => {
    // Use ID if available, otherwise fall back to label
    if (typeof item === 'object' && item !== null && 'id' in item) {
      return `item-${(item as { id: number }).id}`;
    }
    if (typeof item === 'string') {
      return `column-${item}`;
    }
    if (typeof item === 'object' && item !== null && 'label' in item) {
      return `label-${(item as { label: string }).label}`;
    }
    return String(item);
  };

  const config = [
    {
      label: 'id',
      render: (column: unknown) => column.id,
    },
    {
      label: 'status',
      render: (column: unknown) => (
        <span
          className={`min-w-25 rounded-md text-xs px-5 py-3 inline-block ${
            column.status === 'published'
              ? 'bg-green-100 text-green-800 '
              : 'bg-yellow-100 text-yellow-800 '
          }`}
        >
          {column.status}
        </span>
      ),
    },
    {
      label: 'image',
      render: (column: unknown) =>
        column.image ? (
          <img
            className="w-14 h-14 rounded-full object-cover mx-auto"
            src={column.src}
            alt={column.image}
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-amber-200 mx-auto"></div>
        ),
    },
    {
      label: 'name',
      render: (column: unknown) => column.label,
    },
    {
      label: 'quantity',
      render: (column: unknown) => column.quantity,
    },
    {
      label: 'price',
      render: (column: unknown) => `$${column.price.toFixed(2)}`,
    },
    {
      label: 'category',
      render: (column: unknown) => column.category,
    },
    {
      label: 'brand',
      render: (column: unknown) => column.brand,
    },
    {
      label: 'actions',
      render: (column: unknown) => (
        // <SlOptionsVertical className="text-gray-900 text-center mx-auto cursor-pointer" />

        <div className="flex gap-2 justify-center">
          <Button primary>View</Button>
          <Button secondary>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-h3 font-bold mb-6">Manage Products</h1>

      <div className="w-full bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <Table keyfn={keyfn} data={data} config={config} />
        </div>
      </div>
    </div>
  );
}
