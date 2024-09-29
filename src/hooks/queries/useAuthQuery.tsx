import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/app/api/userApi';
import { useRouter } from 'next/navigation';

export const useAuthQuery = () => {
  const router = useRouter();

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const response = await fetchUser();

      // response 자체를 확인하는 방식으로 변경
      if (!response || response.status === 401) {
        throw new Error('Unauthorized');
      }

      return response; // response.data 대신 response 전체 반환
    },
    retry: false,
  });

  // 에러 처리 및 리다이렉트 조건 확인
  if (isError && error instanceof Error && error.message === 'Unauthorized') {
    router.push('/auth');
  }

  return { data, error, isError, isLoading };
};
