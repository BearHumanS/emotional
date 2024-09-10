import React, { useState, useEffect } from 'react';
import RegisterForm from '../register/RegisterForm';
import LoginForm from '../loginForm/LoginForm';

const AuthForm = () => {
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [loading, setLoading] = useState(true); // 해시값 확인 전 로딩 상태 추가
  const [isSwitching, setIsSwitching] = useState(false); // 전환 중인지 확인

  // URL 해시값에 따라 폼 전환
  useEffect(() => {
    const hash = window.location.hash;

    if (!hash) {
      // URL에 해시가 없으면 기본값으로 #signin 설정
      window.location.hash = '#signin';
      setIsLoginActive(true);
    } else if (hash === '#signup') {
      setIsLoginActive(false);
    } else if (hash === '#signin') {
      setIsLoginActive(true);
    }

    setLoading(false);
  }, []);

  // 폼 전환 시 URL 해시값 변경 및 일시적 클릭 차단
  const handleFormSwitch = (formType: 'signin' | 'signup') => {
    if (isSwitching) return; // 전환 중이면 클릭 차단

    setIsSwitching(true); // 전환 중 상태로 설정

    setTimeout(() => {
      if (formType === 'signin') {
        setIsLoginActive(true);
        window.location.hash = '#signin';
      } else {
        setIsLoginActive(false);
        window.location.hash = '#signup';
      }
      setIsSwitching(false); // 전환 후 다시 클릭 허용
    }, 500); // 0.5초 후 전환 완료
  };

  if (loading) {
    return null;
  }

  return (
    //s
    <section className="h-full flex justify-center items-center min-h-screen">
      <div
        className={`relative h-full w-[460px] ${isLoginActive ? 'bg-indigo-600' : 'bg-purple-500'}  rounded-lg p-8 overflow-hidden shadow-md flex justify-center items-center transition-colors duration-500`}
      >
        {/* 로그인 폼 */}
        <article className={`${isLoginActive ? 'block' : 'hidden'} mb-24`}>
          <div>
            <h2 className="sr-only">로그인</h2>
          </div>
          <LoginForm />
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

        {/* 회원가입 폼 */}
        <article className={`${isLoginActive ? 'hidden' : 'block'} mb-24`}>
          <div>
            <h2 className="sr-only">회원가입</h2>
          </div>
          <RegisterForm />
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
