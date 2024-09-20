import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '@/app/api/userApi';
import { useRouter } from 'next/navigation';

export const useAuthQuery = () => {
  const router = useRouter();

  const { data, error, isError } = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const response = await fetchUser();

      if (response.status === 401) {
        throw new Error('Unauthorized');
      }

      return response.data;
    },
    retry: false,
  });

  if (isError && error instanceof Error && error.message === 'Unauthorized') {
    router.push('/auth');
  }

  return { data, error, isError };
};
