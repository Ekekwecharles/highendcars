import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = { items: [] as string[] };

const slice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.items.includes(id))
        state.items = state.items.filter((i) => i !== id);
      else state.items.push(id);
    },
    clearWishlist(state) {
      state.items = [];
    },
  },
});

export const { toggleWishlist, clearWishlist } = slice.actions;
export default slice.reducer;
