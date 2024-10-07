'use client';

import { useRouter } from 'next/navigation';
import { FunctionComponent, useEffect, ComponentType, useState } from 'react';

import RedirectComponent from '@/app/components/RedirectComponent';
import userDataStore from '@/store/userDataStore';
import { fetchUser } from '@/app/api/userApi';

const WithAuth = <P extends object>(
  Component: ComponentType<P>,
): FunctionComponent<P> => {
  const WrappedComponent: FunctionComponent<P> = (props) => {
    const router = useRouter();
    const { userData, setUserData } = userDataStore();
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const user = await fetchUser();
          setUserData(user.user);
          setIsLoading(false);
          console.log(user.user);
        } catch (error) {
          setIsError(true);
          setIsLoading(false);
        }
      };

      checkAuth();

      const intervalId = setInterval(
        () => {
          checkAuth();
        },
        5 * 60 * 1000,
      );

      return () => clearInterval(intervalId);
    }, [setUserData]);

    console.log(userData);

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

    return <Component {...props} />;
  };

  return WrappedComponent;
};

export default WithAuth;
