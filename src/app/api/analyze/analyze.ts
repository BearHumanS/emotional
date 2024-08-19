import axios from 'axios';

export const analyzeDiary = async (prompt: string) => {
  try {
    const res = await axios.post(
      `/api/analyze?prompt=${encodeURIComponent(prompt)}`,
    );
    return res.data.keyword;
  } catch (error) {
    console.error(error);
    throw new Error('프롬프트 분석 실패');
  }
};
