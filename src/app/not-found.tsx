'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import userDataStore from '@/store/userDataStore';

function Redirect() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(3);

  const { userData } = userDataStore();

  useEffect(() => {
    const countdown = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    const timer = setTimeout(() => {
      if (!userData) {
        router.replace('/auth');
      } else {
        router.replace('/');
      }
    }, 3000);

    return () => {
      clearInterval(countdown);
      clearTimeout(timer);
    };
  }, [router, userData]);

  return (
    <section className="w-[460px] h-dvh flex justify-center items-center bg-white rounded-lg p-8 overflow-hidden shadow-md">
      <div className="flex flex-col justify-center items-center gap-2">
        <span className="title1">존재하지 않는 페이지입니다.</span>
        <div className="mt-2 body2 text-text-info">
          <span className="text-primary-8">{seconds}</span>초 뒤에 페이지가
          이동됩니다.
        </div>
      </div>
    </section>
  );
}

export default Redirect;
