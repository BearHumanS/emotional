'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthQuery } from '@/hooks/queries/useAuthQuery';

function Redirect() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(3);
  const { data: userData, isLoading, isError } = useAuthQuery();

  useEffect(() => {
    if (!isLoading) {
      const countdown = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      const timer = setTimeout(() => {
        if (isError || !userData) {
          router.push('/auth');
        } else {
          router.push('/');
        }
      }, 3000);

      return () => {
        clearInterval(countdown);
        clearTimeout(timer);
      };
    }
  }, [isError, isLoading, router, userData]);

  return (
    <section className="w-[460px] h-dvh flex justify-center items-center bg-white rounded-lg p-8 overflow-hidden shadow-md">
      <div className="flex flex-col justify-center items-center gap-2">
        {/* <Image src="/AIGOO.png" width={177} height={90} alt="Loading_logo" /> */}
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
