import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Order } from "@/types/order";
import { loginUser, logout, signupUser } from "./authSlice";

type OrdersStatus = "idle" | "loading" | "succeeded" | "failed";

type OrdersState = {
  orders: Order[];
  status: OrdersStatus;
  error: string | null;
};

const initialState: OrdersState = {
  orders: [],
  status: "idle",
  error: null,
};

const resetOrders = (state: OrdersState) => {
  state.orders = [];
  state.status = "idle";
  state.error = null;
};

export const fetchOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("orders/fetchOrders", async (_, { dispatch, rejectWithValue, getState }) => {
    const token = (getState() as {
      auth: { token: string | null };
    }).auth.token;

    if (!token) {
      dispatch(logout());

      return rejectWithValue("Session expired. Please sign in again.");
    }

    const response = await fetch("/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 401) {
      dispatch(logout());

      return rejectWithValue("Session expired. Please sign in again.");
    }

    if (!response.ok) {
      return rejectWithValue("Failed to load orders.");
    }

    return (await response.json()) as Order[];
  },
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout, resetOrders)
      .addCase(loginUser.fulfilled, resetOrders)
      .addCase(signupUser.fulfilled, resetOrders)
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : action.error.message ?? "Failed to load orders.";
      });
  },
});

export default ordersSlice.reducer;