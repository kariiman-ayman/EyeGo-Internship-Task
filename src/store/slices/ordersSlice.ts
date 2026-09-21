import { createSlice } from "@reduxjs/toolkit";
import { orders } from "@/data/orders";
import { Order } from "@/types/order";

type OrdersState = {
  orders: Order[];
};

const initialState: OrdersState = {
  orders,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
});

export default ordersSlice.reducer;
