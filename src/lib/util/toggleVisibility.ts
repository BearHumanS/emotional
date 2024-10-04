import { Dispatch, SetStateAction } from 'react';

export const toggleVisibility = (setter: Dispatch<SetStateAction<boolean>>) => {
  setter((prev) => !prev);
};
