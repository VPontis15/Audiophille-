import { useQuery } from '@tanstack/react-query';
import API from '../api/API';
import { ProductAPIResponse } from '../types/Dashboard/apiResponses';
import { QueryParams } from '../types/Dashboard/types';
export default function useProductData(queryParams: QueryParams) {
  const api = new API();

  // Create a query key that includes all parameters
  const queryKey = ['products', queryParams];

  return useQuery<ProductAPIResponse>({
    queryKey,
    queryFn: async () => {
      try {
        const response = await api.fetchAll<ProductAPIResponse>(
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
