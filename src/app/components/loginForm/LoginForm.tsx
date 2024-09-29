'use client';

import { fetchLogin } from '@/app/api/userApi';
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

const LoginForm = forwardRef((_, ref) => {
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const router = useRouter();

  useImperativeHandle(ref, () => ({
    resetForm() {
      setUserId('');
      setUserPassword('');
    },
  }));

  const onIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserPassword(e.target.value);
  };

  const onLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (userId && userPassword) {
      try {
        await fetchLogin({
          email: userId,
          password: userPassword,
        });

        toast.success('로그인에 성공했습니다.');
        router.push('/');
      } catch (error) {
        console.error('로그인에 실패:', error);
        toast.error('로그인에 실패했습니다. 다시 시도해주세요.');
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
      <h2 className="text-white text-4xl mb-24 flex justify-center">로그인</h2>
      <form onSubmit={onLoginSubmit} className="flex flex-col gap-4 w-[305px]">
        <div className="relative group">
          <input
            type="text"
            id="id"
            placeholder=" "
            value={userId}
            onChange={onIdChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 outline-none peer mt-2"
          />
          <label
            htmlFor="id"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all duration-300 ease-in-out peer-placeholder-shown:top-[60%] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-[-2px] peer-focus:text-sm peer-focus:text-yellow-500 peer-valid:top-[-2px] peer-valid:text-sm peer-valid:text-white peer-focus:left-1 peer-valid:left-1"
          >
            ID
          </label>
        </div>
        <div className="relative group">
          <input
            type="password"
            id="password"
            placeholder=" "
            value={userPassword}
            onChange={onPasswordChange}
            required
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 outline-none peer mt-2"
          />
          <label
            htmlFor="password"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all duration-300 ease-in-out peer-placeholder-shown:top-[60%] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-[-2px] peer-focus:text-sm peer-focus:text-yellow-500 peer-valid:top-[-2px] peer-valid:text-sm peer-valid:text-white peer-focus:left-1 peer-valid:left-1"
          >
            Password
          </label>
        </div>

        <button
          type="submit"
          className="mt-4 bg-gray-200 text-black font-semibold py-3 rounded-lg w-full hover:text-gray-200 hover:bg-black transition-colors duration-300"
        >
          로그인
        </button>
      </form>
    </section>
  );
});

LoginForm.displayName = 'LoginForm';

export default LoginForm;
