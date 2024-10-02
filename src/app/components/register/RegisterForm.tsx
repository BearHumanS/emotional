'use client';

import { fetchRegister, sendVerification } from '@/app/api/userApi';
import { emailRegex, passwordRegex } from '@/lib/constants/constants';
import useShowPasswordStore from '@/lib/store/useShowPasswordStore';
import { useRouter } from 'next/navigation';
import {
  ChangeEvent,
  FormEvent,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import { toast } from 'react-toastify';
import ChangeIcons from '../ChangeIcons';
import { useMutation } from '@tanstack/react-query';
import UseAnimations from 'react-useanimations';
import loading from 'react-useanimations/lib/loading';
import { formatTime } from '@/lib/util/formatTime';
import useShowConfirmPasswordStore from '@/lib/store/useShowConfirmPasswordStore';

const RegisterForm = forwardRef((_, ref) => {
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const { showPassword, setShowPassword } = useShowPasswordStore();
  const { showConfirmPassword, setShowConfirmPassword } =
    useShowConfirmPasswordStore();
  const [visiblity, setivsiblity] = useState(false);
  const [timer, setTimer] = useState(300);
  const [isExpired, setIsExpired] = useState(false);

  const router = useRouter();

  useImperativeHandle(ref, () => ({
    resetForm() {
      setUserId('');
      setUserPassword('');
      setConfirmPassword('');
      setVerificationCode('');
      setShowPassword(false);
      setivsiblity(false);
      setShowConfirmPassword(false);
      setIsExpired(false);
    },
  }));

  // 타이머
  useEffect(() => {
    let counter: string | number | NodeJS.Timeout | undefined;

    if (visiblity && timer > 0) {
      counter = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsExpired(true);
      clearInterval(counter);
    }

    return () => clearInterval(counter);
  }, [timer, visiblity]);

  const validateEmail = (email: string) => {
    if (!emailRegex.test(email)) {
      toast.warn('이메일 형식에 맞지 않습니다.');
      return false;
    } else {
      return true;
    }
  };

  const validatePassword = (password: string) => {
    if (!passwordRegex.test(password)) {
      toast.warn(
        '비밀번호는 문자, 숫자, 특수 문자를 포함하여 8자 이상이어야 합니다.',
      );
      return false;
    } else {
      return true;
    }
  };

  const validateConfirmPassword = (password: string) => {
    if (password !== userPassword) {
      toast.warn('비밀번호가 일치하지 않습니다.');
      return false;
    } else {
      return true;
    }
  };

  const onIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserPassword(e.target.value);
  };

  const onConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const onVerificationCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value);
  };

  const mutation = useMutation({
    mutationFn: sendVerification,
    onSuccess() {
      if (isExpired) {
        toast.warn('인증 코드가 만료되었습니다. 다시 요청해주세요.');
        return;
      }
      toast.success('인증 코드를 발송했습니다');
      setivsiblity(true);
    },
    onError() {
      toast.error('인증 코드 발송에 실패했습니다.');
      setivsiblity(false);
    },
  });

  const onSendVerifcation = () => {
    mutation.mutate(userId);
  };

  const onRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(userId);
    const isPasswordValid = validatePassword(userPassword);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    if (userPassword !== confirmPassword) {
      toast.warn('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (userId && userPassword && verificationCode) {
      try {
        await fetchRegister({
          email: userId,
          password: userPassword,
          confirmPassword,
          verificationCode,
        });

        toast.success('회원가입을 환영합니다! 로그인해주세요!');
        router.push('/');
      } catch (error) {
        if (error instanceof Error) {
          console.error('회원가입 실패:', error.message);
          toast.error(error.message);
        } else {
          console.error('회원가입 실패: 알 수 없는 에러', error);
          toast.error('알 수 없는 오류가 발생했습니다.');
        }
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <section>
      <h2 className="text-white text-4xl mb-24 flex justify-center">
        회원가입
      </h2>
      <form
        onSubmit={onRegisterSubmit}
        className="flex flex-col gap-4 w-[305px]"
      >
        <div className="flex justify-between items-center">
          <div className="relative">
            <input
              type="text"
              id="register-id"
              placeholder=" "
              value={userId}
              onChange={onIdChange}
              onBlur={() => validateEmail(userId)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 outline-none peer mt-2"
            />
            <label
              htmlFor="register-id"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all duration-300 ease-in-out peer-placeholder-shown:top-[60%] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-[-2px] peer-focus:text-sm peer-focus:text-yellow-500 peer-valid:top-[-2px] peer-valid:text-sm peer-valid:text-white peer-focus:left-1 peer-valid:left-1"
            >
              ID
            </label>
          </div>
          <div className="h-[50px] flex items-end">
            <button
              type="button"
              disabled={mutation.isPending}
              onClick={onSendVerifcation}
              className={`h-[42px] w-[50px] bg-gray-200 outline-none rounded-lg ${
                mutation.isPending ? 'cursor-not-allowed' : 'cursor-pointer'
              } font-semibold hover:text-gray-200 hover:bg-black transtion-color duration-300`}
            >
              {mutation.isPending ? (
                <div className="flex justify-center">
                  <UseAnimations
                    animation={loading}
                    size={24}
                    speed={2}
                    strokeColor="gray"
                  />
                </div>
              ) : (
                '인증'
              )}
            </button>
          </div>
        </div>

        {visiblity && (
          <div className="relative flex justify-between items-center">
            <input
              type="text"
              placeholder="인증코드"
              value={verificationCode}
              onChange={onVerificationCodeChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 outline-none peer mt-2"
            />
            <div className="flex w-[65%] justify-center gap-2">
              <p className="text-yellow-500">남은 시간:</p>
              <p className="w-5 text-gray-200">
                {isExpired ? '만료됨' : `${formatTime(timer)}`}
              </p>
            </div>
          </div>
        )}

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="register-password"
            placeholder=" "
            value={userPassword}
            onChange={onPasswordChange}
            onBlur={() => validatePassword(userPassword)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 outline-none peer mt-2"
          />
          <label
            htmlFor="register-password"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all duration-300 ease-in-out peer-placeholder-shown:top-[60%] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-[-2px] peer-focus:text-sm peer-focus:text-yellow-500 peer-valid:top-[-2px] peer-valid:text-sm peer-valid:text-white peer-focus:left-1 peer-valid:left-1"
          >
            Password
          </label>
          <ChangeIcons onClick={togglePasswordVisibility} show={showPassword} />
        </div>

        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirm-password"
            placeholder=""
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
            onBlur={() => validateConfirmPassword(confirmPassword)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 outline-none peer mt-2"
          />
          <label
            htmlFor="confirm-password"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all duration-300 ease-in-out peer-placeholder-shown:top-[60%] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-[-2px] peer-focus:text-sm peer-focus:text-yellow-500 peer-valid:top-[-2px] peer-valid:text-sm peer-valid:text-white peer-focus:left-1 peer-valid:left-1"
          >
            Confirm Password
          </label>
          <ChangeIcons
            onClick={toggleConfirmPasswordVisibility}
            show={showConfirmPassword}
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-gray-200 text-black font-semibold py-3 rounded-lg w-full hover:text-gray-200 hover:bg-black transition-colors duration-300"
        >
          회원가입
        </button>
      </form>
    </section>
  );
});

RegisterForm.displayName = 'RegisterForm';

export default RegisterForm;
