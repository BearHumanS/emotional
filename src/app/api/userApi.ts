import { isAxiosError } from 'axios';
import { fetchData } from './fetchData';

export type fetchUserDataProps = {
  email: string;
  password: string;
  confirmPassword?: string;
  verificationCode?: string;
};

export const fetchRegister = async ({
  email,
  password,
  confirmPassword,
  verificationCode,
}: fetchUserDataProps) => {
  try {
    const res = await fetchData(
      `/users/register`,
      'post',
      { email, password, confirmPassword, verificationCode },
      true,
    );

    return res;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.message;
      console.error('회원가입 실패:', errorMessage);
      throw new Error(errorMessage);
    }
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
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.message;
      console.error('회원가입 실패:', errorMessage);
      throw new Error(errorMessage);
    }
  }
};

// 로그아웃은 요청이 실패해도 로그아웃 시킬 것 (쿠키 강제 만료)
export const fetchLogOut = async () => {
  try {
    const res = await fetchData('/users/logout', 'post', undefined, true);
    return res;
  } catch (error) {
    console.error('로그아웃 실패:', error);
    // 로그아웃 실패해도 상태 초기화 (쿠키 삭제 등)
    // 쿠키 삭제 예시 (쿠키 라이브러리를 사용하거나 직접 처리)
    document.cookie = 'token=; Max-Age=0; path=/;'; // 쿠키 삭제
    return { success: false }; // 프론트엔드에서 추가 처리 가능
  }
};

export const fetchUser = async () => {
  try {
    const res = await fetchData('/protected', 'get', undefined, true);

    return res;
  } catch (error) {
    console.error('사용자 인증 실패:', error);
    throw new Error('사용자 인증 실패');
  }
};

export const sendVerification = async (email: string) => {
  try {
    const res = await fetchData('/users/verification', 'post', { email }, true);

    return res;
  } catch (error) {
    console.error('인증코드 발송 실패:', error);
    throw new Error('인증코드 발송 실패');
  }
};

export const requestCode = async (email: string) => {
  try {
  } catch (error) {
    console.error('이메일 발송 실패:', error);
    throw new Error('이메일 발송 실패');
  }
};
