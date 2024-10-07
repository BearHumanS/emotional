'use client';

import { fetchRegister, sendVerification, verifyCode } from '@/app/api/userApi';
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
import UseAnimations from 'react-useanimations';
import loading from 'react-useanimations/lib/loading';
import { formatTime } from '@/lib/util/formatTime';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '@/lib/util/validators';
import { toggleVisibility } from '@/lib/util/toggleVisibility';

const RegisterForm = forwardRef((_, ref) => {
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [visiblity, setivsiblity] = useState(false);
  const [timer, setTimer] = useState(300);
  const [isExpired, setIsExpired] = useState(false);
  const [isResend, setIsResend] = useState(false);
  const [isVerify, setIsVerify] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationLoading, setIsVerificationLoading] = useState(false);
  const [isVerifyLoading, setIsVerifyLoading] = useState(false);

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
      setIsResend(false);
      setIsVerify(false);
      setIsLoading(false);
    },
  }));

  // 타이머
  useEffect(() => {
    let counter: string | number | NodeJS.Timeout | undefined;

    if (visiblity && timer > 0 && !isVerify) {
      counter = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsExpired(true);
      clearInterval(counter);
    }

    return () => clearInterval(counter);
  }, [isVerify, timer, visiblity]);

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

  const onSendVerification = async () => {
    const isEmailValid = validateEmail(userId);
    if (!isEmailValid) {
      toast.warn('이메일을 입력해주세요.');
      return;
    }

    try {
      setIsVerificationLoading(true);
      await sendVerification(userId);
      setIsExpired(false);
      setTimer(300);
      setivsiblity(true);
      setIsResend(true);
      setIsVerify(false);
      toast.success('인증 코드가 전송되었습니다.');
    } catch (error) {
      console.error('인증 코드 전송 실패:', error);
      toast.error('인증 코드 전송에 실패했습니다.');
    } finally {
      setIsVerificationLoading(false);
    }
  };

  const onVerify = async () => {
    if (!verificationCode) {
      toast.warn('인증코드를 입력해주세요.');
      return;
    }

    try {
      setIsVerifyLoading(true);
      await verifyCode({ email: userId, verificationCode });
      setIsVerify(true);
      setIsExpired(false);
      toast.success('인증이 완료되었습니다.');
    } catch (error) {
      console.error('인증 실패:', error);
      toast.error('인증에 실패했습니다.');
    } finally {
      setIsVerifyLoading(false);
    }
  };

  const onRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(userId);
    const isPasswordValid = validatePassword(userPassword);
    const isConfirmPasswordValid = validateConfirmPassword(
      confirmPassword,
      userPassword,
    );

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

        toast.success('회원가입을 환영합니다!');
        router.replace('/');
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

  return (
    <section>
      <h2 className="text-white text-4xl mb-12 flex justify-center">
        회원가입
      </h2>
      <form
        onSubmit={onRegisterSubmit}
        className="flex flex-col gap-4 w-[305px]"
      >
        <div className="flex justify-between items-center gap-2">
          <div className="relative w-full">
            <input
              type="text"
              id="register-id"
              placeholder="이메일 형식입니다."
              value={userId}
              onChange={onIdChange}
              onBlur={() => validateEmail(userId)}
              required
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 outline-none peer mt-2"
            />
            <label
              htmlFor="register-id"
              className="absolute opacity-0 left-3 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all duration-300 ease-in-out peer-placeholder-shown:top-[60%] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-[-2px] peer-focus:text-sm peer-focus:text-yellow-500 peer-valid:top-[-2px] peer-valid:text-sm peer-valid:text-white peer-focus:left-1 peer-valid:left-1 peer-focus:opacity-100 peer-valid:opacity-100"
            >
              ID
            </label>
          </div>
          <div className="h-[50px] flex items-end">
            <button
              type="button"
              disabled={isVerificationLoading}
              onClick={onSendVerification}
              className={`h-[42px] w-[50px] bg-gray-200 outline-none rounded-lg ${
                isVerificationLoading ? 'cursor-not-allowed' : 'cursor-pointer'
              } font-semibold hover:text-gray-200 hover:bg-black transtion-color duration-300`}
            >
              {isVerificationLoading ? (
                <div className="flex justify-center">
                  <UseAnimations
                    animation={loading}
                    size={24}
                    speed={2}
                    strokeColor="gray"
                  />
                </div>
              ) : isResend ? (
                '재인증'
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
              className="w-[50%] p-2 border border-gray-300 rounded-lg bg-gray-100 outline-none peer mt-2"
            />
            <div className="flex w-[35%] flex-col h-[50px] items-center justify-center">
              {isVerify ? (
                <p className="text-gray-200">인증 완료</p>
              ) : (
                <>
                  <p className="text-yellow-500">남은 시간</p>
                  <p className="text-gray-200">
                    {isExpired ? '만료됨' : `${formatTime(timer)}`}
                  </p>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={onVerify}
              disabled={isExpired || isVerify}
              className={`h-[42px] w-[50px] bg-gray-200 outline-none rounded-lg ${
                isVerifyLoading || isExpired || isVerify
                  ? 'cursor-not-allowed'
                  : 'cursor-pointer'
              } font-semibold  ${!isExpired && 'hover:bg-black hover:text-gray-200'} transtion-color duration-300`}
            >
              {isVerifyLoading ? (
                <div className="flex justify-center">
                  <UseAnimations
                    animation={loading}
                    size={24}
                    speed={2}
                    strokeColor="gray"
                  />
                </div>
              ) : (
                '확인'
              )}
            </button>
          </div>
        )}

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="register-password"
            placeholder="영문, 숫자, 특수문자 포함 8글자 이상"
            value={userPassword}
            onChange={onPasswordChange}
            onBlur={() => validatePassword(userPassword)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 outline-none peer mt-2"
          />
          <label
            htmlFor="register-password"
            className="absolute opacity-0 left-3 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all duration-300 ease-in-out peer-placeholder-shown:top-[60%] peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-[-2px] peer-focus:text-sm peer-focus:text-yellow-500 peer-valid:top-[-2px] peer-valid:text-sm peer-valid:text-white peer-focus:left-1 peer-valid:left-1 peer-focus:opacity-100 peer-valid:opacity-100"
          >
            Password
          </label>
          <ChangeIcons
            onClick={() => toggleVisibility(setShowPassword)}
            show={showPassword}
          />
        </div>

        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirm-password"
            placeholder=""
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
            onBlur={() =>
              validateConfirmPassword(confirmPassword, userPassword)
            }
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
            onClick={() => toggleVisibility(setShowConfirmPassword)}
            show={showConfirmPassword}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 bg-gray-200 text-black font-semibold py-3 rounded-lg w-full hover:text-gray-200 hover:bg-black transition-colors duration-300"
        >
          {isLoading ? (
            <div className="flex justify-center">
              <UseAnimations
                animation={loading}
                size={24}
                speed={2}
                strokeColor="gray"
              />
            </div>
          ) : (
            '회원가입'
          )}
        </button>
      </form>
    </section>
  );
});

RegisterForm.displayName = 'RegisterForm';

export default RegisterForm;
