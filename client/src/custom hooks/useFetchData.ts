import { useQuery } from '@tanstack/react-query';
import API from '../api/API';

interface FetchResponse<T> {
  status: string;
  data: {
    results: number;
    [key: string]: any;
    totalPages: number;
    currentPage: number;
  };
}

interface QueryOptions {
  fields?: string;
  limit?: number;
  page?: number;
  sort?: string;
  [key: string]: any;
}

/**
 * Custom hook to fetch data from API
 * @param endpoint The API endpoint to fetch data from (e.g., 'brands', 'categories')
 * @param resourceKey The key in the response data object that contains the resource array (e.g., 'brands', 'categories')
 * @param options Query parameters to send with the request
 * @returns The query result with data, loading state, and error
 */
export function useFetchData<T>(
  endpoint: string,
  resourceKey: string,
  options: QueryOptions = {}
) {
  const api = new API();

  return useQuery({
    queryKey: [endpoint, options],
    queryFn: async () => {
      try {
        const response = await api.fetchAll(endpoint, options);
        return {
          data: (response as FetchResponse<T>).data[resourceKey] || [],
          meta: {
            results: (response as FetchResponse<T>).data.results,
            totalPages: (response as FetchResponse<T>).data.totalPages,
            currentPage: (response as FetchResponse<T>).data.currentPage,
          },
          status: (response as FetchResponse<T>).status,
        };
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return {
          data: [],
          meta: { results: 0, totalPages: 0, currentPage: 0 },
          status: 'error',
        };
      }
    },
  });
}
