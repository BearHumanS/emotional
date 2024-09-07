import { instanse_Lambda, instanse_ABS } from './axiosInstance';

type Method = 'get' | 'post' | 'put' | 'delete';

export const fetchData = async (
  url: string,
  method: Method,
  reqData?: unknown,
  useABS: boolean = false,
) => {
  try {
    const instance = useABS ? instanse_ABS : instanse_Lambda;

    const { data } = await instance({
      url,
      method,
      data: reqData,
    });

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
