import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  id: string;
  email: string;
  nickname: string;
  is_admin: boolean;
} | null;
const initialState: { user: User } = { user: null };

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
});

export const { setUser } = slice.actions;
export default slice.reducer;
