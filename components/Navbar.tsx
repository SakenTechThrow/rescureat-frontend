"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { clearAuth, getRole, getToken, type UserRole } from "@/lib/auth";

function readAuth(): { loggedIn: boolean; role: UserRole | null } {
  return {
    loggedIn: Boolean(getToken()),
    role: getRole(),
  };
}

export default function Navbar() {
  const [auth, setAuth] = useState({ loggedIn: false, role: null as UserRole | null });

  const sync = useCallback(() => {
    setAuth(readAuth());
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("auth-change", sync);
    return () => window.removeEventListener("auth-change", sync);
  }, [sync]);

  function handleLogout() {
    clearAuth();
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-10 border-b border-emerald-100 bg-white/95 backdrop-blur-sm">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-emerald-700 hover:text-emerald-800"
        >
          RescuEat
        </Link>
        <ul className="flex flex-wrap items-center gap-1 sm:gap-4">
          <li>
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/deals"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              Deals
            </Link>
          </li>
          {auth.loggedIn ? (
            <li>
              <Link
                href="/reservations"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                Reservations
              </Link>
            </li>
          ) : null}
          <li>
            <Link
              href="/for-cafes"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              For Cafes
            </Link>
          </li>
          {auth.loggedIn && auth.role === "CAFE_OWNER" ? (
            <li>
              <Link
                href="/dashboard/cafe"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                Dashboard
              </Link>
            </li>
          ) : null}
          {auth.loggedIn ? (
            <li>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                Logout
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
