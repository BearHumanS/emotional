import { fetchData } from '../fetchData';

export const analyzeDiary = async (prompt: string) => {
  try {
    const res = await fetchData('/analyzeDiary', 'post', { prompt: prompt });
    return res.keyword;
  } catch (error) {
    console.error(error);
    throw new Error('프롬프트 분석 실패');
  }
};
