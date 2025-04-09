import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import FormInput from '../../utils/FormInput';
import FormWrapper from './FormWrapper';
import { useState, useEffect } from 'react';
import API from '../../../api/API';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { EntityFormProps } from '../../../types/Dashboard/types';
import Button from '../../utils/Button';
import { CategoryResponse } from '../../../types/Dashboard/apiResponses';

export default function EntityForm({
  endpoint,
  queryKey,
  title,
  description,
  additionalFields = [],
  mapToApiPayload = (data) => data,
}: EntityFormProps): React.ReactElement {
  // Get the slug from URL params
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Record<string, string>>({
    name: '',
    slug: slug || '', // Initialize with URL slug if available
  });

  const api = new API();

  const { data: editData, isLoading: isEditDataLoading } = useQuery({
    queryKey: [queryKey, slug],
    queryFn: async () => {
      if (!slug) return null;

      try {
        const result = await api.fetchOne<CategoryResponse>(endpoint, slug);
        return result;
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
    },
    enabled: !!slug, // Only run when slug exists from URL
    staleTime: 1000 * 60 * 5,
  });

  // Update form data when editData is loaded
  useEffect(() => {
    if (editData?.data?.category) {
      const categoryData = editData.data.category;
      setFormData({
        name: categoryData.name || '',
        slug: categoryData.slug || '',
      });
    }
  }, [editData]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (value) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    // If this is the name field, generate a slug
    if (name === 'name') {
      const slugValue = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      setFormData((prev) => ({
        ...prev,
        slug: slugValue,
      }));

      // Clear slug error too
      if (slugValue) {
        setErrors((prev) => ({
          ...prev,
          slug: '',
        }));
      }
    }
  };

  const updateMutation = useMutation({
    mutationFn: async () => {
      const payload = mapToApiPayload(formData);
      return api.updateOne(endpoint, slug as string, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(`${formData.name} updated successfully!`);
      navigate(-1); // Navigate back after successful update
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<{ message: string }>;
      console.error('Update error:', error);

      if (error.response?.data?.message) {
        toast.error(
          `Failed to update ${endpoint}: ${error.response.data.message}`
        );
      } else {
        toast.error(
          `Failed to update ${endpoint}: ${error.message || 'Unknown error'}`
        );
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      // Transform form data if necessary using the mapper function
      const payload = mapToApiPayload(formData);
      return api.createOne(endpoint, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(`${title} created successfully!`);
      setFormData({ name: '', slug: '' });
      navigate(-1); // Navigate back after successful creation
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<{ message: string }>;
      console.error('Create error:', error);

      if (error.response?.data?.message) {
        toast.error(
          `Failed to create ${endpoint}: ${error.response.data.message}`
        );
      } else {
        toast.error(
          `Failed to create ${endpoint}: ${error.message || 'Unknown error'}`
        );
      }
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    let hasErrors = false;
    const newErrors: Record<string, string> = {};

    // Validate required fields
    if (!formData.name) {
      newErrors.name = 'Name is required';
      hasErrors = true;
    }

    if (!formData.slug) {
      newErrors.slug = 'Slug is required';
      hasErrors = true;
    }

    // Set errors if any
    setErrors(newErrors);

    if (!hasErrors) {
      if (slug) {
        updateMutation.mutate();
      } else {
        createMutation.mutate();
      }
    }
  };

  return (
    <FormWrapper
      onSubmit={handleSubmit}
      title={title}
      description={description}
      className="flex flex-col gap-4 w-full bg-white rounded-lg p-6 min-w-[500px]"
    >
      {isEditDataLoading ? (
        <div className="flex justify-center items-center p-8">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <FormInput
            full
            label="Name"
            name="name"
            onChange={handleInputChange}
            value={formData.name}
            type="text"
            className="w-full"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <FormInput
            full
            label="Slug"
            name="slug"
            onChange={handleInputChange}
            value={formData.slug}
            type="text"
            className="w-full"
          />
          {errors.slug && <p className="text-red-500 text-sm">{errors.slug}</p>}

          {/* Render any additional fields passed as props */}
          {additionalFields}

          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            primary
          >
            {createMutation.isPending || updateMutation.isPending
              ? 'Saving...'
              : slug
              ? 'Update'
              : 'Create'}
          </Button>
        </>
      )}
    </FormWrapper>
  );
}
