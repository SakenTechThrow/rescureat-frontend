"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authHeaders, readApiErrorMessage } from "@/lib/auth";
import { apiUrl } from "@/lib/apiBase";

type DeleteListingButtonProps = {
  dealId: number;
  dealTitle: string;
};

export default function DeleteListingButton({
  dealId,
  dealTitle,
}: DeleteListingButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${dealTitle}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(apiUrl(`/api/deals/${dealId}`), {
        method: "DELETE",
        headers: authHeaders(),
      });

      if (!res.ok) {
        throw new Error(await readApiErrorMessage(res));
      }

      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error && err.message) {
        setError(err.message);
      } else {
        setError("Something went wrong while deleting");
      }
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="inline-flex items-center justify-center rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
      {error ? (
        <p className="text-right text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
