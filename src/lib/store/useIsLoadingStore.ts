import { create } from 'zustand';

interface userIsLoadingStoreProps {
  isCheckedLoading: boolean;
  setIsCheckedLoading: (isCheckedLoading: boolean) => void;
}

const userIsLoadingStore = create<userIsLoadingStoreProps>((set) => ({
  isCheckedLoading: false,
  setIsCheckedLoading: (isCheckedLoading) => set({ isCheckedLoading }),
}));

export default userIsLoadingStore;
