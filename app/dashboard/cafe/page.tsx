import Link from "next/link";
import StatCard from "@/components/StatCard";
import DeleteListingButton from "@/components/DeleteListingButton";
import { apiUrl } from "@/lib/apiBase";

type Deal = {
  id: number;
  title: string;
  description: string;
  restaurantName: string;
  originalPrice: number;
  dealPrice: number;
};

async function getDeals(): Promise<Deal[]> {
  const res = await fetch(apiUrl("/api/deals"), {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch deals");
  }

  return res.json();
}

export default async function CafeDashboardPage() {
  const deals = await getDeals();
  const totalOriginalValue = deals.reduce((sum, deal) => sum + deal.originalPrice, 0);
  const totalDealValue = deals.reduce((sum, deal) => sum + deal.dealPrice, 0);
  const totalSavings = totalOriginalValue - totalDealValue;

  const summaryCards = [
    { label: "Active Listings", value: String(deals.length) },
    { label: "Total Listings", value: String(deals.length) },
    { label: "Potential Savings", value: `$${totalSavings.toFixed(2)}` },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100 px-4 py-12 md:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Cafe Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              A simple overview of your listings and today&apos;s impact.
            </p>
          </div>
          <Link
            href="/dashboard/cafe/new-listing"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Create new listing
          </Link>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {summaryCards.map((card) => (
            <StatCard key={card.label} label={card.label} value={card.value} />
          ))}
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white/90 p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-2 border-b border-slate-100 pb-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Your listings</h2>
              <p className="mt-1 text-xs text-slate-600">Fetched from your backend.</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {deals.length === 0 ? (
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-6 text-sm text-slate-600">
                No listings yet. Create your first one to get started.
              </div>
            ) : (
              deals.map((deal) => (
                <div
                  key={deal.id}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 md:flex-row md:items-center"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900">{deal.title}</p>
                    <p className="text-xs text-slate-600">
                      {deal.restaurantName} · ${deal.originalPrice.toFixed(2)} to $
                      {deal.dealPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 md:text-right">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      Active
                    </span>
                    <DeleteListingButton dealId={deal.id} dealTitle={deal.title} />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
