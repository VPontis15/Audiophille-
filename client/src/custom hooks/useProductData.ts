import { useQuery } from '@tanstack/react-query';
import API from '../api/API';
import { APIResponse, QueryParams } from '../types/Dashboard/types';
export default function useProductData(queryParams: QueryParams) {
  const api = new API();

  // Create a query key that includes all parameters
  const queryKey = ['products', queryParams];

  return useQuery<APIResponse>({
    queryKey,
    queryFn: async () => {
      try {
        const response = await api.fetchAll<APIResponse>(
          'products',
          queryParams
        );
        return response;
      } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
    },
  });
}
