import UseAnimations from 'react-useanimations';
import infinity from 'react-useanimations/lib/infinity';

const RedirectComponent = () => {
  return (
    <div className="w-[460px] h-dvh flex justify-center items-center flex-col bg-white rounded-lg p-8 overflow-hidden shadow-md pb-[32dvh] gap-20">
      <UseAnimations animation={infinity} size={56} speed={2} />
      <p className="text-xl font-semibold text-slate-500">로딩 중 입니다.</p>
    </div>
  );
};

export default RedirectComponent;
