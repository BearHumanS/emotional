import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

const axiosConfig_Lambda = {
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
};

const axiosConfig_ABS = {
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
};

export const instanse_Lambda = axios.create(axiosConfig_Lambda);
export const instanse_ABS = axios.create(axiosConfig_ABS);
