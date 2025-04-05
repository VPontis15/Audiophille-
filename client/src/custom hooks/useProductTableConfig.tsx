import { useMemo } from 'react';
import { AdminProductProps, Column } from '../types/Dashboard/types';
import { Skeleton } from '../components/utils/skeleton';
import { FaEdit } from 'react-icons/fa';
import { Link } from 'react-router';
import { MdDeleteForever } from 'react-icons/md';

export function useProductTableConfig() {
  return useMemo<Column[]>(
    () => [
      {
        label: 'id',
        value: 'id',
        render: (item: unknown) => {
          const column = item as AdminProductProps;
          return column.id;
        },
        skeleton: { type: 'number' },
      },
      {
        label: 'status',
        value: 'status',
        render: (item: unknown) => {
          const column = item as AdminProductProps;
          return (
            <span
              className={`min-w-25 rounded-md text-xs px-5 py-3 inline-block ${
                column.status === 'published'
                  ? 'bg-green-100 text-green-800 '
                  : 'bg-yellow-100 text-yellow-800 '
              }`}
            >
              {column.status}
            </span>
          );
        },
        skeleton: { type: 'status' },
      },
      {
        label: 'image',
        value: 'featuredImage',
        sortable: false,
        render: (item: unknown) => {
          const column = item as AdminProductProps;
          if (!column.featuredImage) {
            return (
              <Skeleton className="w-14.5 h-14.5 rounded-md object-cover mx-auto" />
            );
          }

          try {
            const src = JSON.parse(column.featuredImage);
            return (
              <img
                width={58}
                height={58}
                loading="lazy"
                className="w-14.5 h-14.5 rounded-md object-cover mx-auto"
                src={src.thumbnail.url}
                alt={column.name}
              />
            );
          } catch (error) {
            console.error('Error parsing featuredImage JSON:', error);
            return (
              <Skeleton className="w-14.5 h-14.5 rounded-md object-cover mx-auto" />
            );
          }
        },
        skeleton: { type: 'image' },
      },
      {
        label: 'name',
        value: 'name',
        render: (item: unknown) => {
          const column = item as AdminProductProps;
          return column.name;
        },
        skeleton: { type: 'text' },
      },
      {
        label: 'quantity',
        value: 'quantity',
        sortable: true,
        render: (item: unknown) => {
          const column = item as AdminProductProps;
          return (
            <span
              className={`font-bold ${
                column.quantity ? 'text-green-500' : 'text-error'
              }`}
            >
              {column.quantity
                ? `in stock(${column.quantity})`
                : 'Out of stock'}
            </span>
          );
        },
        skeleton: { type: 'number' },
      },
      {
        label: 'price',
        value: 'price',
        sortable: true,
        render: (item: unknown) => {
          const column = item as AdminProductProps;
          return column.salePrice ? (
            <div className="flex flex-col gap-1">
              <span className=" line-through text-xs">{`$${column.price}`}</span>
              <span className="">${column.salePrice}</span>
            </div>
          ) : (
            `€${column.price}`
          );
        },
        skeleton: { type: 'number' },
      },
      {
        label: 'category',
        value: 'category',
        sortable: true,
        render: (item: unknown) => {
          const column = item as AdminProductProps;
          return column.category;
        },
        skeleton: { type: 'text' },
      },
      {
        label: 'brand',
        value: 'brand',
        sortable: true,
        render: (item: unknown) => {
          const column = item as AdminProductProps;
          return column.brand;
        },
        skeleton: { type: 'text' },
      },
      {
        label: 'actions',
        sortable: false,
        render: (item: unknown) => {
          const column = item as AdminProductProps;
          return (
            <div className="flex gap-2 justify-center">
              <Link to={`/admin/dashboard/products/${column.slug}`}>
                <FaEdit className="text-text w-5 h-5" />
              </Link>
              <Link
                to={`/admin/dashboard/products/manage/${column.slug}/delete`}
                className=" text-red-600 hover:text-red-800"
                title="Delete product"
              >
                <MdDeleteForever size={20} />
              </Link>
            </div>
          );
        },
        skeleton: { type: 'action' },
      },
    ],
    []
  );
}
