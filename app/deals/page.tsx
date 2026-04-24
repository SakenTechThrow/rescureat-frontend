import DealsBrowse from "@/components/DealsBrowse";
import { apiUrl } from "@/lib/apiBase";

async function getDeals(): Promise<unknown[]> {
  const res = await fetch(apiUrl("/api/deals"), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch deals");
  return res.json();
}

export default async function DealsPage() {
  const raw = await getDeals();

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-slate-900">Browse Deals</h1>
        <p className="mt-3 text-slate-600">
          Affordable surplus food from nearby cafes.
        </p>

        <div className="mt-8">
          <DealsBrowse initialDeals={raw as any} />
        </div>
      </div>
    </main>
  );
}
