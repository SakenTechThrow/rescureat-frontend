"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { authHeaders, readApiErrorMessage } from "@/lib/auth";

type Reservation = {
  id: number;
  dealId: number;
  // если после auth у тебя userName пропал — это норм, просто покажем fallback
  userName?: string;
  createdAt: string;
};

function formatCreatedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const headers = useMemo(() => authHeaders(), []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:8080/api/reservations", {
          method: "GET",
          headers,
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(await readApiErrorMessage(res));
        }

        const data = (await res.json()) as Reservation[];
        setReservations(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.message ?? "Failed to fetch reservations");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [headers]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100 px-4 py-12 md:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Reservations
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              All deal reservations from the backend.
            </p>
          </div>
          <Link
            href="/deals"
            className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-emerald-800 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Back to deals
          </Link>
        </header>

        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white/90 shadow-sm">
          {loading ? (
            <div className="px-5 py-8 text-sm text-slate-600">Loading…</div>
          ) : error ? (
            <div className="px-5 py-8">
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
              <p className="mt-3 text-sm text-slate-600">
                If you’re not logged in, go to{" "}
                <Link href="/login" className="text-emerald-700 underline">
                  Login
                </Link>
                .
              </p>
            </div>
          ) : reservations.length === 0 ? (
            <div className="px-5 py-8 text-sm text-slate-600">
              No reservations yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-700">
                <thead className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">ID</th>
                    <th className="px-5 py-3 font-semibold">Deal</th>
                    <th className="px-5 py-3 font-semibold">User</th>
                    <th className="px-5 py-3 font-semibold">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-slate-100 last:border-b-0"
                    >
                      <td className="px-5 py-4 font-medium text-slate-900">
                        #{r.id}
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/deals/${r.dealId}`}
                          className="font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
                        >
                          Deal #{r.dealId}
                        </Link>
                      </td>
                      <td className="px-5 py-4">{r.userName ?? "You"}</td>
                      <td className="px-5 py-4 text-slate-600">
                        {formatCreatedAt(r.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}