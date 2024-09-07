import { fetchData } from './fetchData';

type fetchRegisterProps = {
  email: string;
  password: string;
};

export const fetchRegister = async ({
  email,
  password,
}: fetchRegisterProps) => {
  try {
    const res = await fetchData(
      `/users/register`,
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
