"use client";

import { useSelector } from "react-redux";
import ProtectedRoute from "@/components/ProtectedRoute";
import { RootState } from "@/store/store";
import OrdersTable from "@/components/orders/OrdersTable";
import SalesChart from "@/components/dashboard/SalesChart";

export default function DashboardPage() {
  const orders = useSelector((state: RootState) => state.orders.orders);

  const totalOrders = orders.length;

  const totalSales = orders.reduce((total, order) => total + order.amount, 0);

  const completedOrders = orders.filter(
    (order) => order.status === "Completed",
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending",
  ).length;

  return (
    <ProtectedRoute>
      <main className="mx-auto min-h-screen max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:p-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Sales Dashboard
          </h1>

          <p className="mt-1.5 text-slate-500">
            Overview of your sales and orders.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="glass glass-hover rounded-2xl p-5">
            <p className="text-sm font-medium text-slate-500">Total Orders</p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {totalOrders}
            </p>
          </div>

          <div className="glass glass-hover rounded-2xl p-5">
            <p className="text-sm font-medium text-slate-500">Total Sales</p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              ${totalSales.toLocaleString()}
            </p>
          </div>

          <div className="glass glass-hover rounded-2xl p-5">
            <p className="text-sm font-medium text-slate-500">
              Completed Orders
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {completedOrders}
            </p>
          </div>

          <div className="glass glass-hover rounded-2xl p-5">
            <p className="text-sm font-medium text-slate-500">
              Pending Orders
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {pendingOrders}
            </p>
          </div>
        </div>
          <div className="mt-6">
            <SalesChart />
          </div>
          <div className="mt-6">
            <OrdersTable />
          </div>
      </main>
    </ProtectedRoute>
  );
}
