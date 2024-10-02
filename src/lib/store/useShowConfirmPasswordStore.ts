import { create } from 'zustand';

interface useShowConfirmPasswordStoreProps {
  showConfirmPassword: boolean;
  setShowConfirmPassword: (
    showConfirmPassword: boolean | ((prev: boolean) => boolean),
  ) => void;
}

const useShowConfirmPasswordStore = create<useShowConfirmPasswordStoreProps>(
  (set) => ({
    showConfirmPassword: false,
    setShowConfirmPassword: (showConfirmPassword) =>
      set((state) => ({
        showConfirmPassword:
          typeof showConfirmPassword === 'function'
            ? (showConfirmPassword as (prev: boolean) => boolean)(
                state.showConfirmPassword,
              )
            : showConfirmPassword,
      })),
  }),
);

export default useShowConfirmPasswordStore;
