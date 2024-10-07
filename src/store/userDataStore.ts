import { create } from 'zustand';

type User = {
  id: string;
  email: string;
  iat: number;
  exp: number;
} | null;

type UserDataState = {
  userData: User;
  setUserData: (user: User) => void;
};

const userDataStore = create<UserDataState>((set) => ({
  userData: null,
  setUserData: (userData) => set({ userData }),
}));

export default userDataStore;
