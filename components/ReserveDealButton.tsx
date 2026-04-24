"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  authHeaders,
  getStoredEmail,
  getStoredName,
  readApiErrorMessage,
} from "@/lib/auth";
import { apiUrl } from "@/lib/apiBase";

type ReserveDealButtonProps = {
  dealId: number;
};

export default function ReserveDealButton({ dealId }: ReserveDealButtonProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleReserve() {
    setIsSubmitting(true);
    setError(null);

    try {
      const userName =
        getStoredName()?.trim() || getStoredEmail()?.trim() || "Guest";

      const res = await fetch(apiUrl("/api/reservations"), {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ dealId, userName }),
      });

      if (!res.ok) {
        throw new Error(await readApiErrorMessage(res));
      }

      router.push("/reservation-success");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error && err.message) {
        setError(err.message);
      } else {
        setError("Something went wrong while reserving this deal");
      }
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleReserve}
        disabled={isSubmitting}
        className="inline-block rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Reserving..." : "Reserve this deal"}
      </button>

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
