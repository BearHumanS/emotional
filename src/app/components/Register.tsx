'use clent';

import { emailRegex, passwordRegex } from '@/lib/constants/constants';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useState } from 'react';
import { fetchResister } from '../api/userApi';

function Register() {
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [errors, setErrors] = useState({ id: '', password: '' });

  const router = useRouter();

  const validateEmail = () => {
    if (!emailRegex.test(userId)) {
      setErrors((prev) => ({ ...prev, id: '이메일 형식에 맞지않습니다.' }));
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

  const onResisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    validateEmail();
    validatePassword();

    if (!errors.id && !errors.password) {
      try {
        await fetchResister({
          email: userId,
          password: userPassword,
        });

        router.push('/');
      } catch (error) {
        console.error('회원가입 실패:', error);
        alert('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <form onSubmit={onResisterSubmit}>
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
        {errors.id && <span style={{ color: 'red' }}>{errors.id}</span>}
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
        {errors.password && (
          <span style={{ color: 'red' }}>{errors.password}</span>
        )}
      </div>
      <button type="submit">회원가입</button>
    </form>
  );
}

export default Register;
