"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import {
  loginWithEmailPassword,
  registerAccount,
  type RegisterApiRole,
} from "@/lib/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

type Role = "student" | "cafe" | "";

function mapRole(r: Role): RegisterApiRole | null {
  if (r === "student") return "STUDENT";
  if (r === "cafe") return "CAFE_OWNER";
  return null;
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    role?: string;
  }>({});

  function validate(): boolean {
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Name is required.";
    if (!email.trim()) next.email = "Email is required.";
    else if (!EMAIL_REGEX.test(email)) next.email = "Please enter a valid email.";
    if (!password) next.password = "Password is required.";
    else if (password.length < MIN_PASSWORD_LENGTH)
      next.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    if (!role) next.role = "Please select a role.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;

    const apiRole = mapRole(role);
    if (!apiRole) {
      setErrors((prev) => ({ ...prev, role: "Please select a role." }));
      return;
    }

    setLoading(true);
    try {
      const reg = await registerAccount(
        name.trim(),
        email.trim(),
        password,
        apiRole,
      );

      if (!reg.ok) {
        setApiError(reg.message);
        return;
      }

      if (reg.loggedIn) {
        if (reg.role === "CAFE_OWNER") {
          router.replace("/dashboard/cafe");
        } else {
          router.replace("/deals");
        }
        router.refresh();
        return;
      }

      const login = await loginWithEmailPassword(email.trim(), password);
      if (login.ok) {
        if (login.role === "CAFE_OWNER") {
          router.replace("/dashboard/cafe");
        } else {
          router.replace("/deals");
        }
        router.refresh();
        return;
      }

      setApiError(
        login.message ||
          "Account may have been created. Try logging in on the next page.",
      );
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100 px-4 py-12 md:py-20">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-sm md:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Create your RescuEat account
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Join as a student or a cafe to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {apiError && (
              <div
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {apiError}
              </div>
            )}

            <div>
              <label
                htmlFor="register-name"
                className="block text-sm font-medium text-slate-700"
              >
                Name
              </label>
              <input
                id="register-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => name && setErrors((e) => ({ ...e, name: undefined }))}
                className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Your name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="register-email"
                className="block text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => email && setErrors((e) => ({ ...e, email: undefined }))}
                className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="register-password"
                className="block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() =>
                  password &&
                  setErrors((e) => ({ ...e, password: undefined }))
                }
                className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="At least 8 characters"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <span className="block text-sm font-medium text-slate-700">
                I am a
              </span>
              <div className="mt-2 flex gap-3">
                <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 has-[:checked]:border-emerald-500 has-[:checked]:ring-1 has-[:checked]:ring-emerald-500">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={role === "student"}
                    onChange={() => {
                      setRole("student");
                      setErrors((e) => ({ ...e, role: undefined }));
                    }}
                    className="h-4 w-4 border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm font-medium text-slate-900">
                    Student
                  </span>
                </label>
                <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 has-[:checked]:border-emerald-500 has-[:checked]:ring-1 has-[:checked]:ring-emerald-500">
                  <input
                    type="radio"
                    name="role"
                    value="cafe"
                    checked={role === "cafe"}
                    onChange={() => {
                      setRole("cafe");
                      setErrors((e) => ({ ...e, role: undefined }));
                    }}
                    className="h-4 w-4 border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm font-medium text-slate-900">
                    Cafe Owner
                  </span>
                </label>
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.role}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Log in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
