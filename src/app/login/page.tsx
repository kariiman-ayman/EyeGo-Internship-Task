"use client";

import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import { login, logout } from "@/store/slices/authSlice";
import { AppDispatch, RootState } from "@/store/store";

const MOCK_EMAIL = "admin@example.com";
const MOCK_PASSWORD = "Eyego@2026";

const JUST_LOGGED_IN_KEY = "eyego-just-logged-in";

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    if (sessionStorage.getItem(JUST_LOGGED_IN_KEY)) {
      sessionStorage.removeItem(JUST_LOGGED_IN_KEY);

      return;
    }

    dispatch(logout());
  }, [dispatch, isAuthenticated]);

  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
      sessionStorage.setItem(JUST_LOGGED_IN_KEY, "1");
      dispatch(login({ email }));
      router.push("/dashboard");
      return;
    }

    setError("Invalid email or password.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="glass w-full max-w-md rounded-3xl p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/30">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 20V10M10 20V4M16 20V8M22 20H2"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Sales Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-slate-600"
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
              placeholder="Enter your email"
              required
              className="glass-input w-full"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-600"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                placeholder="Enter your password"
                required
                className="glass-input w-full pr-11"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
              >
                {showPassword ? <Eye size={17} /> : <EyeOff size={17} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-rose-600" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn w-full">
            Sign In
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-white/80 bg-white/50 p-4 text-sm text-slate-600 backdrop-blur">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10">
              <KeyRound size={14} strokeWidth={2} className="text-[#6366f1]" />
            </div>

            <p className="font-semibold text-slate-700">Demo credentials</p>
          </div>

          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Email</span>
              <span className="font-medium text-slate-700">{MOCK_EMAIL}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Password</span>
              <span className="font-medium text-slate-700">
                {MOCK_PASSWORD}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
