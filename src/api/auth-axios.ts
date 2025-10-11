import axios, { type AxiosResponse } from 'axios';
import { baseUrl } from './base-url.ts';

// Create an Axios instance with baseURL
const axiosInstance = axios.create({
  baseURL: baseUrl, 
  timeout: 1000 * 60, 
});

// Define types for the parameters
export const authAxios = async <T = any>(
  isAuth: boolean,
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  data: any = {},
  headersType: 'application/json' | 'multipart/form-data' = 'application/json',
  responseType: 'json' | 'blob' | 'text' = 'json'
): Promise<any> => {
  const token = localStorage.getItem('token'); 
  try {
    const response: AxiosResponse<T> = await axiosInstance({
      url: endpoint,
      method: method,
      data,
      headers: {
        'Content-Type': headersType,
        responseType,
        ...(isAuth && token ? { Authorization: "Bearer " + token } : {}),
      },
    });
    return response;
  } catch (error: any) {
    // need to make it
    return error?.response ? error.response : error;
  }
};

export default authAxios;

