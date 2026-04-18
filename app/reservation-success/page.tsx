import Link from "next/link";

export default function ReservationSuccessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100 px-4 py-12 md:py-20">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-sm text-center md:p-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
            <svg
              className="h-6 w-6 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Your deal has been reserved
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Head to the cafe before the pickup deadline. Show your confirmation
            or order code at the counter to collect your food.
          </p>
          <Link
            href="/deals"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Back to deals
          </Link>
        </div>
      </div>
    </main>
  );
}
