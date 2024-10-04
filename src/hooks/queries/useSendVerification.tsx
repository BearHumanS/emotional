import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { sendVerification } from '@/app/api/userApi';

interface useSendVerificationProps {
  setivsiblity: (value: boolean) => void;
}

export const useSendVerification = ({
  setivsiblity,
}: useSendVerificationProps) => {
  return useMutation({
    mutationFn: sendVerification,
    onSuccess() {
      toast.success('인증코드를 발송했습니다.');
    },
    onError(error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      setivsiblity(false);
    },
  });
};
