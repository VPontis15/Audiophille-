import cartReducer from './slices/cartSlice';
import userReducer from './slices/user';
import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    settings: settingsReducer,
    user: userReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
