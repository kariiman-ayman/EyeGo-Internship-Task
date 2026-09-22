import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import ordersReducer from "./slices/ordersSlice";
import { saveSession } from "@/utils/session";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: ordersReducer,
  },
});

store.subscribe(() => {
  const { auth } = store.getState();

  saveSession({
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    token: auth.token,
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
