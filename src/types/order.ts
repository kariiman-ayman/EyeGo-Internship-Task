export type OrderStatus = "Completed" | "Pending" | "Cancelled";

export type Order = {
  id: string;
  customer: string;
  product: string;
  status: OrderStatus;
  amount: number;
  date: string;
};
