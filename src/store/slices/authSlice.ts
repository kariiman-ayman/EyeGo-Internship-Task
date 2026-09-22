import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadSession } from "@/utils/session";

type User = {
  email: string;
};

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
};

const stored = loadSession();
const hasStoredSession = Boolean(stored?.isAuthenticated && stored?.token);

const initialState: AuthState = {
  isAuthenticated: hasStoredSession,
  user: hasStoredSession ? (stored?.user ?? null) : null,
  token: hasStoredSession ? (stored?.token ?? null) : null,
};

export const loginUser = createAsyncThunk<
  { user: User; token: string },
  { email: string; password: string }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    return rejectWithValue((data.error as string) ?? "Invalid email or password.");
  }

  return data as { user: User; token: string };
});

export const signupUser = createAsyncThunk<
  { user: User; token: string },
  { email: string; password: string }
>("auth/signupUser", async (credentials, { rejectWithValue }) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    return rejectWithValue((data.error as string) ?? "Sign up failed.");
  }

  return data as { user: User; token: string };
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      });
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;