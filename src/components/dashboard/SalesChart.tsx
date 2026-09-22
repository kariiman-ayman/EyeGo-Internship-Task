"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function SalesChart() {
  const orders = useSelector((state: RootState) => state.orders.orders);

  const chartData = orders.map((order) => ({
    date: order.date.slice(5),
    sales: order.amount,
  }));

  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Sales Over Time
        </h2>

        <p className="text-sm text-slate-500">Daily sales based on orders</p>
      </div>

      <div className="h-[250px] w-full sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 10,
            }}
          >
            <defs>
              <linearGradient id="salesStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.22)" />

            <XAxis
              dataKey="date"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />

            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={52}
            />

            <Tooltip
              cursor={{
                stroke: "rgba(99,102,241,0.35)",
                strokeDasharray: "4 4",
              }}
              contentStyle={{
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(12px)",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.9)",
                boxShadow: "0 8px 24px rgba(49,61,125,0.18)",
                color: "#1e293b",
                fontSize: 12,
                fontWeight: 600,
              }}
              formatter={(value) => [
                `$${Number(value).toLocaleString()}`,
                "Sales",
              ]}
            />

            <Line
              type="monotone"
              dataKey="sales"
              stroke="url(#salesStroke)"
              strokeWidth={2.5}
              dot={{ r: 2.5, fill: "#6366f1", strokeWidth: 0 }}
              activeDot={{ r: 4.5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
