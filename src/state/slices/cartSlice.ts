import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../../types/ProductTypes';

type CartState = {
  items: CartItem[];
  totalQuantity: number;
  changed: boolean;
};

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  changed: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state: CartState, action: PayloadAction<CartItem>) {
      state.totalQuantity++;
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
      state.totalQuantity -= existingItem.quantity;
      state.changed = true;
      state.items = state.items.filter((item) => item.id !== id);
    },
    emptyCart(state: CartState) {
      state.items = [];
      state.totalQuantity = 0;
    },
  },
});

export const { addToCart, removeFromCart, emptyCart } = cartSlice.actions;
export default cartSlice.reducer;
