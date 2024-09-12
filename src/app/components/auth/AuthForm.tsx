import React, { useState, useEffect, useRef } from 'react';
import RegisterForm from '../register/RegisterForm';
import LoginForm from '../loginForm/LoginForm';

type FormRef = {
  resetForm: () => void;
};

const AuthForm = () => {
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);

  const loginFormRef = useRef<FormRef>(null);
  const registerFormRef = useRef<FormRef>(null);

  useEffect(() => {
    const hash = window.location.hash;

    if (!hash) {
      window.location.hash = '#signin';
      setIsLoginActive(true);
    } else if (hash === '#signup') {
      setIsLoginActive(false);
    } else if (hash === '#signin') {
      setIsLoginActive(true);
    }

    setLoading(false);
  }, []);

  const handleFormSwitch = (formType: 'signin' | 'signup') => {
    if (isSwitching) return;

    setIsSwitching(true);

    setTimeout(() => {
      if (formType === 'signin') {
        setIsLoginActive(true);
        window.location.hash = '#signin';
        if (registerFormRef.current) {
          registerFormRef.current.resetForm(); // 회원가입 폼 초기화
        }
      } else {
        setIsLoginActive(false);
        window.location.hash = '#signup';
        if (loginFormRef.current) {
          loginFormRef.current.resetForm(); // 로그인 폼 초기화
        }
      }
      setIsSwitching(false);
    }, 500);
  };

  if (loading) {
    return null;
  }

  return (
    <section className="h-full flex justify-center items-center min-h-screen">
      <div
        className={`relative h-full w-[460px] ${isLoginActive ? 'bg-indigo-600' : 'bg-purple-500'}  rounded-lg p-8 overflow-hidden shadow-md flex justify-center items-center transition-colors duration-500`}
      >
        <article className={`${isLoginActive ? 'block' : 'hidden'} mb-24`}>
          <div>
            <h2 className="sr-only">로그인</h2>
          </div>
          <LoginForm ref={loginFormRef} />
          <div className="text-center mt-4 text-white">
            계정이 없으신가요?{' '}
            <button
              className="cursor-pointer underline text-white hover:text-rose-500 transition-colors duration-300 font-bold"
              onClick={() => handleFormSwitch('signup')}
            >
              회원가입
            </button>
          </div>
        </article>

        <article className={`${isLoginActive ? 'hidden' : 'block'} mb-24`}>
          <div>
            <h2 className="sr-only">회원가입</h2>
          </div>
          <RegisterForm ref={registerFormRef} />
          <div className="text-center mt-4 text-white">
            이미 계정이 있으신가요?{' '}
            <button
              className="cursor-pointer underline text-white hover:text-rose-500 transition-colors duration-300 font-bold"
              onClick={() => handleFormSwitch('signin')}
            >
              로그인
            </button>
          </div>
        </article>
      </div>
    </section>
  );
};

export default AuthForm;
