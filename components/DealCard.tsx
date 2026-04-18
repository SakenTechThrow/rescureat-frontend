import Link from "next/link";
import type { Deal } from "@/lib/mock-data";

type DealCardProps = {
  deal: Deal;
  /** URL for the reserve action. Defaults to /reservation-success. */
  reserveHref?: string;
};

/**
 * Card showing one deal: cafe, title, prices, pickup time, and a Reserve link.
 * Used on the deals list page.
 */
export default function DealCard({ deal, reserveHref = "/reservation-success" }: DealCardProps) {
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-emerald-700">
          {deal.cafe}
        </p>
        <h2 className="text-sm font-semibold text-slate-900">{deal.title}</h2>
        <div className="mt-1 flex items-baseline gap-2 text-sm">
          <span className="text-xs text-slate-400 line-through">
            {deal.originalPrice}
          </span>
          <span className="font-semibold text-emerald-700">
            {deal.discountedPrice}
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-600">{deal.pickupTime}</p>
      </div>

      <Link
        href={reserveHref}
        className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
      >
        Reserve
      </Link>
    </article>
  );
}
