import axios, { AxiosRequestHeaders, InternalAxiosRequestConfig } from "axios";
interface Data {
  user?: User;
  user_id?: string;
  user_name?: string;
  content?: string;
}

interface User {
  username: string;
  password: string;
  confirmation_password?: string;
}

interface Request {
  method: string;
  url: string;
  data: Data;
  params?: string;
}

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      } as AxiosRequestHeaders;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

export const request = async ({ method, url, data, params }: Request) => {
  const options = {
    method,
    data,
    params,
    url,
  };

  const result = await axiosInstance(options);
  return result.data;
};
