import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadSession } from "@/utils/session";

type User = {
  email: string;
};

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
};

const stored = loadSession();

const initialState: AuthState = {
  isAuthenticated: stored?.isAuthenticated ?? false,
  user: stored?.user ?? null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
