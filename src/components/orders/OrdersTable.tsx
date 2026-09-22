"use client";

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { OrderStatus } from "@/types/order";
import ExportButtons from "@/components/orders/ExportButtons";

type SortField = "id" | "customer" | "amount" | "date";
type SortDirection = "asc" | "desc";

const ORDERS_PER_PAGE = 5;

export default function OrdersTable() {
  const orders = useSelector((state: RootState) => state.orders.orders);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"All" | OrderStatus>("All");
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrders = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchValue) ||
        order.customer.toLowerCase().includes(searchValue) ||
        order.product.toLowerCase().includes(searchValue);

      const matchesStatus = status === "All" || order.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, status]);

  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      let comparison = 0;

      if (sortField === "amount") {
        comparison = a.amount - b.amount;
      } else if (sortField === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        comparison = a[sortField].localeCompare(b[sortField]);
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredOrders, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedOrders.length / ORDERS_PER_PAGE);

  //   useEffect(() => {
  //     if (totalPages > 0 && currentPage > totalPages) {
  //       setCurrentPage(totalPages);
  //     }
  //   }, [currentPage, totalPages]);

  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE,
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: "All" | OrderStatus) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }

    setCurrentPage(1);
  };

  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return "";
    }

    return sortDirection === "asc" ? " ↑" : " ↓";
  };

  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="border-b border-white/60 px-5 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Orders
            </h2>
          </div>

          <ExportButtons orders={sortedOrders} />
        </div>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search orders..."
              className="glass-input w-full sm:w-64"
            />

            <select
              value={status}
              onChange={(event) =>
                handleStatusChange(event.target.value as "All" | OrderStatus)
              }
              className="glass-input cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-white/40 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">
                <button
                  type="button"
                  onClick={() => handleSort("id")}
                  className="hover:text-slate-900"
                >
                  Order ID{getSortIndicator("id")}
                </button>
              </th>

              <th className="px-5 py-3 font-medium">
                <button
                  type="button"
                  onClick={() => handleSort("customer")}
                  className="hover:text-slate-900"
                >
                  Customer{getSortIndicator("customer")}
                </button>
              </th>

              <th className="px-5 py-3 font-medium">Product</th>

              <th className="px-5 py-3 font-medium">Status</th>

              <th className="px-5 py-3 font-medium">
                <button
                  type="button"
                  onClick={() => handleSort("amount")}
                  className="hover:text-slate-900"
                >
                  Amount{getSortIndicator("amount")}
                </button>
              </th>

              <th className="px-5 py-3 font-medium">
                <button
                  type="button"
                  onClick={() => handleSort("date")}
                  className="hover:text-slate-900"
                >
                  Date{getSortIndicator("date")}
                </button>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/50">
            {paginatedOrders.map((order) => (
              <tr
                key={order.id}
                className="transition-colors hover:bg-white/50"
              >
                <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-900">
                  {order.id}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                  {order.customer}
                </td>

                <td className="px-5 py-4 text-slate-700">{order.product}</td>

                <td className="px-5 py-4">
                  <span
                    className={`pill ${
                      order.status === "Completed"
                        ? "border-emerald-300/60 bg-emerald-500/10 text-emerald-700"
                        : order.status === "Pending"
                          ? "border-amber-300/60 bg-amber-400/15 text-amber-700"
                          : "border-rose-300/60 bg-rose-500/10 text-rose-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-900">
                  ${order.amount.toLocaleString()}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                  {order.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedOrders.length === 0 && (
        <div className="px-5 py-12 text-center">
          <p className="text-base font-medium text-slate-900">No orders found</p>

          <p className="mt-1 text-sm text-slate-500">
            Try changing your search or filter.
          </p>
        </div>
      )}

      {totalPages > 0 && (
        <div className="flex flex-col gap-3 border-t border-white/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * ORDERS_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * ORDERS_PER_PAGE, sortedOrders.length)}
            </span>{" "}
            of <span className="font-medium">{sortedOrders.length}</span> orders
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
              className="btn-glass text-slate-600"
            >
              Previous
            </button>

            <span className="px-1 text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((page) => page + 1)}
              className="btn-glass text-slate-600"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
