import { toast } from 'react-toastify';
import { emailRegex, passwordRegex } from '../constants/constants';

export const validateEmail = (email: string) => {
  if (!emailRegex.test(email)) {
    toast.warn('이메일 형식에 맞지 않습니다.');
    return false;
  } else {
    return true;
  }
};

export const validatePassword = (password: string) => {
  if (!passwordRegex.test(password)) {
    toast.warn(
      '비밀번호는 문자, 숫자, 특수 문자를 포함하여 8자 이상이어야 합니다.',
    );
    return false;
  } else {
    return true;
  }
};

export const validateConfirmPassword = (
  password: string,
  userPassword: string,
) => {
  if (password !== userPassword) {
    toast.warn('비밀번호가 일치하지 않습니다.');
    return false;
  } else {
    return true;
  }
};
