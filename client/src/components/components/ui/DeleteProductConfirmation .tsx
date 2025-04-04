import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../../../api/API';
import { toast } from 'react-toastify';
import Button from '../../utils/Button';

export default function DeleteProductConfirmation(): React.ReactElement {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const api = new API();
  // Create delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => api.deleteOne('products', slug!),
    onSuccess: () => {
      // Invalidate products query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['products'] });
      // Show success toast
      toast.success('Product deleted successfully');
      // Navigate back to products list
      navigate('/admin/dashboard/products/manage');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error('Failed to delete product');
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-4">Delete Product</h2>
      <p>Are you sure you want to delete this product?</p>
      <p className="text-sm text-gray-500 mt-2">
        This action cannot be undone.
      </p>

      {deleteMutation.isPending && (
        <p className="text-blue-500 italic mt-2">Deleting product...</p>
      )}

      <div className="flex justify-end mt-4">
        <Button
          sm
          outline
          className="bg-error border-error hover:bg-error/80 text-white px-4 py-2 rounded-md mr-2"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
        </Button>
        <Button
          sm
          secondary
          className="bg-gray-200 !border-gray-200 text-gray-800 px-4 py-2 rounded-md"
          onClick={handleCancel}
          disabled={deleteMutation.isPending}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
