"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { LogOut, RefreshCw } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { RootState, AppDispatch } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import { fetchOrders } from "@/store/slices/ordersSlice";
import OrdersTable from "@/components/orders/OrdersTable";
import SalesChart from "@/components/dashboard/SalesChart";

function StatSkeleton() {
  return (
    <div className="glass animate-pulse rounded-2xl p-5">
      <div className="h-3 w-24 rounded-full bg-slate-400/30" />
      <div className="mt-3 h-7 w-16 rounded-full bg-slate-400/30" />
    </div>
  );
}

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const orders = useSelector((state: RootState) => state.orders.orders);
  const status = useSelector((state: RootState) => state.orders.status);
  const error = useSelector((state: RootState) => state.orders.error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchOrders());
    }
  }, [dispatch, status]);

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
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Sales Dashboard
            </h1>

            <p className="mt-1.5 text-slate-500">
              Overview of your sales and orders.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              dispatch(logout());
              router.push("/login");
            }}
            className="btn-glass text-slate-600"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>

        {status === "loading" && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </div>
        )}

        {status === "failed" && (
          <div className="glass mt-4 flex flex-col items-center gap-3 rounded-2xl px-5 py-14 text-center">
            <p className="text-base font-medium text-slate-900">
              Failed to load orders
            </p>

            <p className="text-sm text-slate-500">
              {error ?? "Something went wrong while fetching your orders."}
            </p>

            <button
              type="button"
              onClick={() => dispatch(fetchOrders())}
              className="btn-glass mt-1 text-slate-600"
            >
              <RefreshCw size={15} />
              Retry
            </button>
          </div>
        )}

        {status === "succeeded" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="glass glass-hover rounded-2xl p-5">
                <p className="text-sm font-medium text-slate-500">
                  Total Orders
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {totalOrders}
                </p>
              </div>

              <div className="glass glass-hover rounded-2xl p-5">
                <p className="text-sm font-medium text-slate-500">
                  Total Sales
                </p>

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
          </>
        )}
      </main>
    </ProtectedRoute>
  );
}