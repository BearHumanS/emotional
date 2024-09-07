import { fetchData } from './fetchData';

type fetchResisterProps = {
  email: string;
  password: string;
};

export const fetchResister = async ({
  email,
  password,
}: fetchResisterProps) => {
  try {
    const res = await fetchData(
      `/users/resister`,
      'post',
      { email, password },
      true,
    );

    return res;
  } catch (error) {
    console.error('회원가입 실패:', error);
    throw new Error('회원가입 요청 실패');
  }
};
