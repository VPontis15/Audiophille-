import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../../types/ProductTypes';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';

type CartState = {
  items: CartItem[];
  changed: boolean;
};

const initialState: CartState = {
  items: localStorage.getItem('cart')
    ? JSON.parse(localStorage.getItem('cart') || '[]')
    : [],
  changed: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state: CartState, action: PayloadAction<CartItem>) {
      state.changed = true;
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          price: newItem.price,
          name: newItem.name,
          image: newItem.image,
          quantity: newItem.quantity,
          total: newItem.total,
        });
      } else {
        existingItem.quantity += newItem.quantity;
        existingItem.total += newItem.total;
      }
    },
    removeFromCart(state: CartState, action: PayloadAction<string>) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (!existingItem) return;
      state.changed = true;
      state.items = state.items.filter((item) => item.id !== id);
    },
    emptyCart(state: CartState) {
      state.items = [];
      state.changed = true;
      localStorage.removeItem('cart');
    },
    increaseQuantity(state: CartState, action: PayloadAction<string>) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (!existingItem) return;
      state.changed = true;
      existingItem.quantity++;
      existingItem.total = existingItem.price * existingItem.quantity;
      const savedOnLocalStorage = JSON.parse(
        localStorage.getItem('cart') || '[]'
      );
      const updatedCart = savedOnLocalStorage.map((item: CartItem) => {
        if (item.id === id) {
          item.quantity++;
          item.total = item.price * item.quantity;
        }
        return item;
      });
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    },
    decreaseQuantity(state: CartState, action: PayloadAction<string>) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (!existingItem) return;
      state.changed = true;
      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.total = existingItem.price * existingItem.quantity;
      }
      const savedOnLocalStorage = JSON.parse(
        localStorage.getItem('cart') || '[]'
      ); // Get the cart from local storage
      const updatedCart = savedOnLocalStorage
        .map((item: CartItem) => {
          if (item.id === id) {
            item.quantity--;
            item.total = item.price * item.quantity;
          }
          return item;
        })
        .filter((item: CartItem) => item.quantity > 0);

      localStorage.setItem('cart', JSON.stringify(updatedCart));
    },
  },
});

export const { addToCart, removeFromCart, emptyCart } = cartSlice.actions;
export default cartSlice.reducer;
// Redux hooks with types

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
