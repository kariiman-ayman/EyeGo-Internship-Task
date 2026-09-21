"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded-lg bg-white p-8 text-center shadow-md">
          <h1 className="mb-3 text-3xl font-bold text-gray-900">Dashboard</h1>

          <p className="text-gray-600">
            The sales dashboard will be built here.
          </p>
        </div>
      </main>
    </ProtectedRoute>
  );
}
