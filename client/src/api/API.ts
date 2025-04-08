import axios from 'axios';

export default class API {
  baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL;
  }
  async fetchAll<T>(
    endpoint: string,
    params?: Record<string, unknown>
  ): Promise<T> {
    const config = {
      params: params,
    };

    const response = await axios.get<T>(`${this.baseUrl}/${endpoint}?`, config);

    return response.data;
  }

  async fetchOne<T>(endpoint: string, id: string): Promise<T> {
    const response = await axios.get<T>(`${this.baseUrl}/${endpoint}/${id}`);
    return response.data;
  }

  async deleteOne<T>(endpoint: string, slug: string): Promise<T> {
    const response = await axios.delete<T>(
      `${this.baseUrl}/${endpoint}/${slug}`
    );
    return response.data;
  }

  async getCategoriesHierarchy<T>(): Promise<T> {
    const response = await axios.get<T>(`${this.baseUrl}/categories/hierarchy`);
    return response.data;
  }

  async createOne<T>(
    endpoint: string,
    data: Record<string, unknown>
  ): Promise<T> {
    const response = await axios.post<T>(`${this.baseUrl}/${endpoint}`, data);
    return response.data;
  }
}
