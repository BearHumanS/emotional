import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const axiosConfig = {
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
};

export const instanse = axios.create(axiosConfig);
