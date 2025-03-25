import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  isOpen: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export default settingsSlice.reducer;
export const { openCart, closeCart, toggleTheme } = settingsSlice.actions;
