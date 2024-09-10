'use client';

import { fetchRegister } from '@/app/api/userApi';
import { emailRegex, passwordRegex } from '@/lib/constants/constants';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useState } from 'react';

function RegisterForm() {
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [errors, setErrors] = useState({ id: '', password: '' });

  const router = useRouter();

  const validateEmail = () => {
    if (!emailRegex.test(userId)) {
      setErrors((prev) => ({ ...prev, id: '이메일 형식에 맞지 않습니다.' }));
    } else {
      setErrors((prev) => ({ ...prev, id: '' }));
    }
  };

  const validatePassword = () => {
    if (!passwordRegex.test(userPassword)) {
      setErrors((prev) => ({
        ...prev,
        password:
          '비밀번호는 문자, 숫자, 특수 문자를 포함하여 8자 이상이어야 합니다.',
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: '' }));
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
    validateEmail();
    validatePassword();

    if (!errors.id && !errors.password) {
      try {
        await fetchRegister({
          email: userId,
          password: userPassword,
        });

        router.push('/auth#login');
      } catch (error) {
        console.error('회원가입 실패:', error);
        alert('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <section>
      <h2 className="text-white text-4xl mb-24 flex justify-center">
        회원가입
      </h2>
      <form
        onSubmit={onRegisterSubmit}
        className="flex flex-col gap-4 w-[305px]"
      >
        <div className="w-full">
          <label htmlFor="id" className="text-white">
            ID
          </label>
          <input
            type="text"
            id="id"
            placeholder="ex) example@example.com"
            value={userId}
            onChange={onIdChange}
            required
            className="w-full mt-2 p-2 rounded-lg"
          />
          {errors.id && (
            <span className="text-red-500 font-bold">{errors.id}</span>
          )}
        </div>
        <div>
          <label htmlFor="password" className="text-white">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={userPassword}
            onChange={onPasswordChange}
            required
            className="w-full mt-2 p-2 rounded-lg"
          />
          {errors.password && (
            <span className="text-red-500 font-bold">{errors.password}</span>
          )}
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
}

export default RegisterForm;
