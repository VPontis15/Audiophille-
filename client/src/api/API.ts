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
}
