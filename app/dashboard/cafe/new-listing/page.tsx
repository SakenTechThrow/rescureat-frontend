"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authHeaders, readApiErrorMessage } from "@/lib/auth";

export default function NewListingPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [dealPrice, setDealPrice] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) return setError("Title is required");
    if (!restaurantName.trim()) return setError("Cafe name is required");

    const original = Number(originalPrice);
    const deal = Number(dealPrice);

    if (Number.isNaN(original) || original < 0)
      return setError("Original price must be a valid number >= 0");
    if (Number.isNaN(deal) || deal < 0)
      return setError("Deal price must be a valid number >= 0");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/deals", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          restaurantName: restaurantName.trim(),
          originalPrice: original,
          dealPrice: deal,
        }),
      });

      if (!res.ok) {
        throw new Error(await readApiErrorMessage(res));
      }

      router.push("/deals");
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-200";

  const textareaClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-200";

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold text-slate-900">New Listing</h1>
        <p className="mt-3 text-slate-600">
          Publish a discounted surplus food offer for students.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-5 rounded-3xl border border-slate-200 p-6 shadow-sm"
        >
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Food title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="e.g. Evening Pastries Box"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={textareaClass}
              placeholder="Short description..."
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Cafe name
            </label>
            <input
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className={inputClass}
              placeholder="e.g. Bakery Corner"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Original price
              </label>
              <input
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className={inputClass}
                placeholder="e.g. 10"
                inputMode="decimal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Discounted price
              </label>
              <input
                value={dealPrice}
                onChange={(e) => setDealPrice(e.target.value)}
                className={inputClass}
                placeholder="e.g. 5"
                inputMode="decimal"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? "Publishing..." : "Publish listing"}
          </button>
        </form>
      </div>
    </main>
  );
}