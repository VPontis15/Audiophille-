import { useMutation, useQueryClient } from '@tanstack/react-query';
import FormInput from '../../utils/FormInput';
import FormWrapper from './FormWrapper';
import { useState } from 'react';
import API from '../../../api/API';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { AxiosError } from 'axios';

export default function AddForm(): React.ReactElement {
  const [category, setCategory] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const api = new API();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [error, setError] = useState<{
    category: { required: string };
    slug: { required: string };
  }>({
    category: { required: '' },
    slug: { required: '' },
  });

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setCategory(value);

    // Generate slug whenever category changes
    const slugValue = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setSlug(slugValue);

    // Clear category error when user types
    if (value) {
      setError((prev) => ({
        ...prev,
        category: { required: '' },
      }));
    }

    // Clear slug error too since we're generating a slug
    if (slugValue) {
      setError((prev) => ({
        ...prev,
        slug: { required: '' },
      }));
    }
  };

  const handleSlugChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSlug(value);

    // Clear slug error when user types
    if (value) {
      setError((prev) => ({
        ...prev,
        slug: { required: '' },
      }));
    }
  };

  const createMutation = useMutation({
    mutationFn: async () =>
      api.createOne('categories', { name: category, slug }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully!');
      setCategory('');
      setSlug('');
      navigate(-1); // Navigate back after successful creation
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<{ message: string }>;
      console.error('Create error:', error);

      // Access the error message from the backend response
      if (error.response?.data?.message) {
        toast.error(
          `Failed to create category: ${error.response.data.message}`
        );
      } else {
        toast.error(
          `Failed to create category: ${error.message || 'Unknown error'}`
        );
      }
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    let hasError = false;

    if (!category) {
      setError((prev) => ({
        ...prev,
        category: { required: 'Category name is required' },
      }));
      hasError = true;
    } else {
      setError((prev) => ({
        ...prev,
        category: { required: '' },
      }));
    }

    if (!slug) {
      setError((prev) => ({
        ...prev,
        slug: { required: 'Slug is required' },
      }));
      hasError = true;
    } else {
      setError((prev) => ({
        ...prev,
        slug: { required: '' },
      }));
    }

    if (!hasError) {
      createMutation.mutate();
    }
  };

  return (
    <FormWrapper
      onSubmit={handleSubmit}
      title="Add Category"
      description="Add a new category"
      className="flex flex-col gap-4 w-full bg-white rounded-lg p-6 min-w-[500px]"
    >
      <FormInput
        full
        label="Category Name"
        name="title"
        onChange={handleCategoryChange}
        value={category}
        type="text"
        className="w-full"
      />
      {error.category.required && (
        <p className="text-red-500 text-sm">{error.category.required}</p>
      )}
      <FormInput
        full
        label="Slug"
        name="slug"
        onChange={handleSlugChange} // Allow manual edits to slug
        value={slug}
        type="text"
        className="w-full"
      />
      {error.slug.required && (
        <p className="text-red-500 text-sm">{error.slug.required}</p>
      )}
    </FormWrapper>
  );
}
