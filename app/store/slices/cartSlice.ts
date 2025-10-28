import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CartItem = { id: string; qty: number; price: number };
const initialState: { items: CartItem[] } = { items: [] };

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      state.items.push(action.payload);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = slice.actions;
export default slice.reducer;
