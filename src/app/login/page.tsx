"use client";

import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { login } from "@/store/slices/authSlice";
import { AppDispatch } from "@/store/store";

const MOCK_EMAIL = "admin@example.com";
const MOCK_PASSWORD = "admin123";

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
      dispatch(login({ email }));
      router.push("/dashboard");
      return;
    }

    setError("Invalid email or password.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
          Admin Sales Dashboard
        </h1>

        <p className="mb-6 text-center text-gray-600">Sign in to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              placeholder="admin@example.com"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              placeholder="Enter your password"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 rounded-md bg-gray-50 p-3 text-sm text-gray-600">
          <p className="font-medium">Demo credentials</p>
          <p>Email: admin@example.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </main>
  );
}
