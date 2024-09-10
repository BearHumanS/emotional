'use client';

import { fetchLogin } from '@/app/api/userApi';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useState } from 'react';

function LoginForm() {
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const router = useRouter();

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

        router.push('/');
      } catch (error) {
        console.error('로그인에 실패:', error);
        alert('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <section>
      <h2 className="text-white text-4xl mb-24 flex justify-center">로그인</h2>
      <form onSubmit={onLoginSubmit} className="flex flex-col gap-4 w-[305px]">
        <div>
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
}

export default LoginForm;
