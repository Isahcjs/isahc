
import { HttpClient } from './client.js';
import { RequestOptions, ResponseData } from '../utils/types.js';

// Global client instance
const globalClient = new HttpClient();

// Fetch-style function
export async function fetch<T = any>(url: string, options: RequestOptions = {}): Promise<ResponseData<T>> {
  return globalClient.request<T>(url, options);
}

// Create client instance
export function createClient(baseURL?: string): HttpClient {
  return new HttpClient(baseURL);
}

// Convenience functions
export async function get<T = any>(url: string, options: Omit<RequestOptions, 'method'> = {}): Promise<ResponseData<T>> {
  return globalClient.get<T>(url, options);
}

export async function post<T = any>(url: string, data?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<ResponseData<T>> {
  return globalClient.post<T>(url, data, options);
}

export async function put<T = any>(url: string, data?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<ResponseData<T>> {
  return globalClient.put<T>(url, data, options);
}

export async function del<T = any>(url: string, options: Omit<RequestOptions, 'method'> = {}): Promise<ResponseData<T>> {
  return globalClient.delete<T>(url, options);
}

export async function patch<T = any>(url: string, data?: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<ResponseData<T>> {
  return globalClient.patch<T>(url, data, options);
}

// Export client class
export { HttpClient };
