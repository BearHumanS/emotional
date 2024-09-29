import { IoMdEye } from '@react-icons/all-files/io/IoMdEye';
import { IoMdEyeOff } from '@react-icons/all-files/io/IoMdEyeOff';
import useShowPasswordStore from '@/lib/store/useShowPasswordStore';

interface ChangeIconsProps {
  onClick: () => void;
}

function ChangeIcons({ onClick }: ChangeIconsProps) {
  const { showPassword } = useShowPasswordStore();
  return (
    <div
      onClick={onClick}
      className="absolute top-1/2 right-2 transform -translate-y-1/3 cursor-pointer"
    >
      <IoMdEye
        size={24}
        className={`transition-opacity duration-300 ease-in-out absolute ${
          showPassword ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <IoMdEyeOff
        size={24}
        className={`transition-opacity duration-300 ease-in-out ${
          showPassword ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
}

export default ChangeIcons;
