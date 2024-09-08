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

  const onRegisterSubmit = async (e: FormEvent) => {
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
    <form onSubmit={onRegisterSubmit}>
      <div>
        <label htmlFor="id">ID</label>
        <input
          type="text"
          id="id"
          placeholder="ex) example@example.com"
          value={userId}
          onChange={onIdChange}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="text"
          id="password"
          placeholder="Enter your password"
          value={userPassword}
          onChange={onPasswordChange}
          required
        />
      </div>
      <button type="submit">로그인</button>
    </form>
  );
}

export default LoginForm;
