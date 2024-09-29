'use client';

import { useRouter } from 'next/navigation';
import { FunctionComponent, useEffect, ComponentType } from 'react';
import { useAuthQuery } from '@/hooks/queries/useAuthQuery';
import LoadingComponent from '@/app/components/LoadingComponent';
import RedirectComponent from '@/app/components/RedirectComponent';

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
          }, 2500);

          return () => clearTimeout(timer);
        }
      }
    }, [router, userData, isLoading, isError]);

    if (isError || !userData) {
      return <RedirectComponent />;
    }

    // 인증된 사용자일 때만 컴포넌트 렌더링
    return <Component {...props} />;
  };

  return WrappedComponent;
};

export default WithAuth;
