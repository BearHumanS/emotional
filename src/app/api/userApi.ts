import { fetchData } from './fetchData';

type fetchUserDataProps = {
  email: string;
  password: string;
};

export const fetchRegister = async ({
  email,
  password,
}: fetchUserDataProps) => {
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

export const fetchLogin = async ({ email, password }: fetchUserDataProps) => {
  try {
    const res = await fetchData(
      '/users/login',
      'post',
      { email, password },
      true,
    );

    return res;
  } catch (error) {
    console.error('로그인 실패:', error);
    throw new Error('로그인 요청 실패');
  }
};

// 로그아웃은 요청이 실패해도 로그아웃 시킬 것 (쿠키 강제 만료)
export const fetchLogOut = async () => {
  try {
    const res = await fetchData('/users/logout', 'post', true);

    return res;
  } catch (error) {
    console.error('로그아웃 실패:', error);
    throw new Error('로그아웃 요청 실패');
  }
};
