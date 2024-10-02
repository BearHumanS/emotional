import { create } from 'zustand';

interface useShowPasswordStoreProps {
  showPassword: boolean;
  setShowPassword: (
    showPassword: boolean | ((prev: boolean) => boolean),
  ) => void;
}

const useShowPasswordStore = create<useShowPasswordStoreProps>((set) => ({
  showPassword: false,
  setShowPassword: (showPassword) =>
    set((state) => ({
      showPassword:
        typeof showPassword === 'function'
          ? (showPassword as (prev: boolean) => boolean)(state.showPassword)
          : showPassword,
    })),
}));

export default useShowPasswordStore;
