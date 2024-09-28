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
      if (!isLoading && (!userData || isError)) {
        const timer = setTimeout(() => {
          router.replace('/auth');
        }, 1000);

        return () => clearTimeout(timer);
      }
    }, [router, userData, isLoading, isError]);

    // 데이터 로딩 중일 때 로딩 화면을 보여줌
    if (isLoading) {
      return <>loading</>;
    }

    // 인증된 사용자일 때만 컴포넌트 렌더링
    if (!userData) {
      return <>not user</>;
    }

    return <Component {...props} />;
  };

  return WrappedComponent;
};

export default WithAuth;
