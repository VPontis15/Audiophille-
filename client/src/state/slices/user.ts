import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';

interface User {
  name: string;
  phone: string;
  email: string;
  address: string;
  zipcode: string;
  city: string;
  isAdmin: boolean;
  cart: string[];
}

const initialState = {
  user: null as User | null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
      localStorage.removeItem('authToken');
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
export const useAppDispatch = () => useDispatch<AppDispatch>();
