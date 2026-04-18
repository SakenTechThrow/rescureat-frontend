type StatCardProps = {
  /** Short label shown above the value (e.g. "Active Listings"). */
  label: string;
  /** Main value to display (e.g. "4" or "€86"). */
  value: string;
};

/**
 * A simple card showing a label and a highlighted value.
 * Used for dashboard summary stats (e.g. Active Listings, Reserved Today).
 */
export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white/90 p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-emerald-700">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
