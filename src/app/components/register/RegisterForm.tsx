'use client';

import { fetchRegister } from '@/app/api/userApi';
import { emailRegex, passwordRegex } from '@/lib/constants/constants';
import { useRouter } from 'next/navigation';
import {
  ChangeEvent,
  FormEvent,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import { toast } from 'react-toastify';

const RegisterForm = forwardRef((_, ref) => {
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  /*  const [errors, setErrors] = useState({ id: '', password: '' }); */

  const [debouncedEmail, setDebouncedEmail] = useState(userId);
  const [debouncedPassword, setDebouncedPassword] = useState(userPassword);

  const router = useRouter();

  useImperativeHandle(ref, () => ({
    resetForm() {
      setUserId('');
      setUserPassword('');
      /* setErrors({ id: '', password: '' }); */
    },
  }));

  // 이메일과 비밀번호에 대한 디바운스 로직 적용
  useEffect(() => {
    const emailHandler = setTimeout(() => {
      setDebouncedEmail(userId);
    }, 500);

    return () => {
      clearTimeout(emailHandler);
    };
  }, [userId]);

  useEffect(() => {
    const passwordHandler = setTimeout(() => {
      setDebouncedPassword(userPassword);
    }, 500);

    return () => {
      clearTimeout(passwordHandler);
    };
  }, [userPassword]);

  useEffect(() => {
    if (debouncedEmail !== '') {
      validateEmail(debouncedEmail);
    } else {
      /* setErrors((prev) => ({ ...prev, id: '' })); */
    }
  }, [debouncedEmail]);

  useEffect(() => {
    if (debouncedPassword !== '') {
      validatePassword(debouncedPassword);
    } else {
      /* setErrors((prev) => ({ ...prev, password: '' })); */
    }
  }, [debouncedPassword]);

  const validateEmail = (email: string) => {
    if (!emailRegex.test(email)) {
      /* setErrors((prev) => ({ ...prev, id: '이메일 형식에 맞지 않습니다.' })); */
      toast.warn('이메일 형식에 맞지 않습니다.');
      return false;
    } else {
      /* setErrors((prev) => ({ ...prev, id: '' })); */
      return true;
    }
  };

  const validatePassword = (password: string) => {
    if (!passwordRegex.test(password)) {
      /* setErrors((prev) => ({
        ...prev,
        password:
          '비밀번호는 문자, 숫자, 특수 문자를 포함하여 8자 이상이어야 합니다.',
      })); */
      toast.warn(
        '비밀번호는 문자, 숫자, 특수 문자를 포함하여 8자 이상이어야 합니다.',
      );
      return false;
    } else {
      /* setErrors((prev) => ({ ...prev, password: '' })); */
      return true;
    }
  };

  const onIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserPassword(e.target.value);
  };

  const onRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(debouncedEmail);
    const isPasswordValid = validatePassword(debouncedPassword);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    if (debouncedEmail && debouncedPassword) {
      try {
        await fetchRegister({
          email: debouncedEmail,
          password: debouncedPassword,
        });

        toast.success('회원가입을 환경합니다! 로그인해주세요!');
        router.push('/');
      } catch (error) {
        console.error('회원가입 실패:', error);
        toast.error('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  useEffect(() => {
    const inputs = document.querySelectorAll('input');

    inputs.forEach((input) => {
      if (input.value !== '') {
        const label = input.nextElementSibling;
        if (label) {
          label.classList.add('peer-valid');
        }
      }
    });
  }, []);

  return (
    <section>
      <h2 className="text-white text-4xl mb-24 flex justify-center">
        회원가입
      </h2>
      <form
        onSubmit={onRegisterSubmit}
        className="flex flex-col gap-4 w-[305px]"
      >
        <div className="relative group">
          <input
            type="text"
            id="register-id"
            placeholder=" "
            value={userId}
            onChange={onIdChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 outline-none peer mt-2"
          />
          <label
            htmlFor="register-id"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all duration-300 ease-in-out peer-placeholder-shown:top-[60%] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-[-2px] peer-focus:text-sm peer-focus:text-yellow-500 peer-valid:top-[-2px] peer-valid:text-sm peer-valid:text-white peer-focus:left-1 peer-valid:left-1"
          >
            ID
          </label>
          {/*  {errors.id && (
            <span className="text-yellow-500 font-bold">{errors.id}</span>
          )} */}
        </div>
        <div className="relative group">
          <input
            type="password"
            id="register-password"
            placeholder=" "
            value={userPassword}
            onChange={onPasswordChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 outline-none peer mt-2"
          />
          <label
            htmlFor="register-password"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all duration-300 ease-in-out peer-placeholder-shown:top-[60%] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-[-2px] peer-focus:text-sm peer-focus:text-yellow-500 peer-valid:top-[-2px] peer-valid:text-sm peer-valid:text-white peer-focus:left-1 peer-valid:left-1"
          >
            Password
          </label>
          {/*   {errors.password && (
            <span className="text-yellow-500 font-bold">{errors.password}</span>
          )} */}
        </div>

        <button
          type="submit"
          className="mt-4 bg-gray-200 text-black font-semibold py-3 rounded-lg w-full hover:text-gray-200 hover:bg-black transition-colors duration-300"
        >
          회원가입
        </button>
      </form>
    </section>
  );
});

RegisterForm.displayName = 'RegisterForm';

export default RegisterForm;
