'use client';

import { useRouter } from 'next/navigation';
import { FunctionComponent, useEffect, ComponentType } from 'react';
import { useAuthQuery } from '@/hooks/queries/useAuthQuery';

const WithAuth = <P extends object>(
  Component: ComponentType<P>,
): FunctionComponent<P> => {
  const WrappedComponent: FunctionComponent<P> = (props) => {
    const router = useRouter();

    const { data: userData, isError, isLoading } = useAuthQuery();

    useEffect(() => {
      if (!isLoading) {
        if (isError || !userData) {
          const timer = setTimeout(() => {
            router.replace('/auth');
          }, 1000);

          return () => clearTimeout(timer);
        }
      }
    }, [router, userData, isLoading, isError]);

    // 인증 실패 시 "Redirecting to login..."가 아닌 컴포넌트를 리턴하게 설정
    if (isLoading) {
      return <>Loading...</>;
    }

    if (isError || !userData) {
      return <>Redirecting to login...</>;
    }

    // 인증된 사용자일 때만 컴포넌트 렌더링
    return <Component {...props} />;
  };

  return WrappedComponent;
};

export default WithAuth;
