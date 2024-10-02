// ChangeIcons 컴포넌트
import { IoMdEye } from '@react-icons/all-files/io/IoMdEye';
import { IoMdEyeOff } from '@react-icons/all-files/io/IoMdEyeOff';

interface ChangeIconsProps {
  show: boolean;
  onClick: () => void;
}

function ChangeIcons({ show, onClick }: ChangeIconsProps) {
  return (
    <div
      onClick={onClick}
      className="absolute top-1/2 right-2 transform -translate-y-1/3 cursor-pointer"
    >
      {show ? (
        <IoMdEye
          size={24}
          className="transition-opacity duration-300 ease-in-out"
        />
      ) : (
        <IoMdEyeOff
          size={24}
          className="transition-opacity duration-300 ease-in-out"
        />
      )}
    </div>
  );
}

export default ChangeIcons;
