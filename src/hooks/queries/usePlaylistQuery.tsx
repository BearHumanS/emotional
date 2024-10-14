import { useQuery } from '@tanstack/react-query';
import { fetchYoutubeVideos } from '@/app/api/video/video';

export const usePlaylistQuery = (keyword: string) => {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ['search', keyword],
    queryFn: async () => {
      return await fetchYoutubeVideos(keyword);
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    enabled: !!keyword,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  return { data, error, isError, isLoading };
};
