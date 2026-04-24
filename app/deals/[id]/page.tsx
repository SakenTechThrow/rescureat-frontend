import Link from "next/link";
import ReserveDealButton from "@/components/ReserveDealButton";
import { apiUrl } from "@/lib/apiBase";

type Deal = {
  id: number;
  title: string;
  description: string;
  restaurantName: string;
  originalPrice: number;
  dealPrice: number;
};

async function getDeal(id: string): Promise<Deal> {
  const res = await fetch(apiUrl(`/api/deals/${id}`), {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch deal");
  }

  return res.json();
}

export default async function DealDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deal = await getDeal(id);

  return (
    <main className="min-h-screen bg-white px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/deals"
          className="text-sm font-medium text-emerald-600 hover:underline"
        >
          ← Back to deals
        </Link>

        <div className="mt-6 rounded-3xl border border-slate-200 p-8 shadow-sm">
          <p className="text-sm font-medium text-emerald-600">
            {deal.restaurantName}
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">{deal.title}</h1>

          <p className="mt-4 text-lg text-slate-600">{deal.description}</p>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-lg text-slate-400 line-through">
              ${deal.originalPrice.toFixed(2)}
            </span>
            <span className="text-3xl font-bold text-emerald-600">
              ${deal.dealPrice.toFixed(2)}
            </span>
          </div>

          <div className="mt-8">
            <ReserveDealButton dealId={deal.id} />
          </div>
        </div>
      </div>
    </main>
  );
}
