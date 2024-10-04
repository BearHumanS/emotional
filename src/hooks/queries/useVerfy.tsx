import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { verifyCode } from '@/app/api/userApi';

interface useVerifyProps {
  setIsVerify: (value: boolean) => void;
}

export const useVerify = ({ setIsVerify }: useVerifyProps) => {
  return useMutation({
    mutationFn: verifyCode,
    onSuccess() {
      toast.success('인증코드가 확인되었습니다.');
    },
    onError(error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      setIsVerify(false);
    },
  });
};
