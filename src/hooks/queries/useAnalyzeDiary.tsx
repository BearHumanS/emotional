import { analyzeDiary } from '@/app/api/analyze/analyze';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useAnalyzeDiary = () => {
  return useMutation({
    mutationFn: (diary: string) => analyzeDiary(diary),
    onSuccess: (result) => {
      return result;
    },
    onError: (error) => {
      if (error instanceof Error) {
        console.error('Error analyzing diary:', error);
        toast.error(error.message);
      }
    },
  });
};
