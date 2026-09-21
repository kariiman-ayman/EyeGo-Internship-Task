"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function OrdersTable() {
  const orders = useSelector((state: RootState) => state.orders.orders);

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-3 font-medium">Order ID</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Date</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-900">
                  {order.id}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                  {order.customer}
                </td>

                <td className="px-5 py-4 text-gray-700">{order.product}</td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      order.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-900">
                  ${order.amount.toLocaleString()}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                  {order.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
