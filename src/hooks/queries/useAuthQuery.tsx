import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/app/api/userApi';
import { useRouter } from 'next/navigation';

export const useAuthQuery = () => {
  const router = useRouter();

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const response = await fetchUser();

      if (!response || response.status === 401) {
        throw new Error('Unauthorized');
      }

      return response;
    },
    retry: false,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 30,
    refetchInterval: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  if (isError && error instanceof Error && error.message === 'Unauthorized') {
    router.push('/auth');
  }

  return { data, error, isError, isLoading };
};
