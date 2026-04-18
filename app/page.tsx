import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100 px-4 py-12 md:py-20">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 md:gap-14">
        <section className="grid items-center gap-10 md:grid-cols-[3fr,2fr]">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-3 py-1 text-xs font-medium text-emerald-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>RescuEat · MVP for cafes & students</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Help cafes rescue surplus food.
                <span className="block text-emerald-700">
                  Help students eat for less.
                </span>
              </h1>
              <p className="max-w-xl text-pretty text-lg leading-relaxed text-slate-600">
                RescuEat connects local cafes with nearby students so today&apos;s
                unsold food becomes tonight&apos;s affordable dinner—rather than
                tomorrow&apos;s waste.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/deals"
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                Browse deals
              </Link>
              <Link
                href="/for-cafes"
                className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white/80 px-6 py-3 text-sm font-semibold text-emerald-800 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                For cafes
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-slate-600">
              <div className="max-w-xs space-y-1">
                <p className="font-semibold text-slate-900">For students</p>
                <p>Find quality meals nearby at up to 60% off, ready for quick pickup.</p>
              </div>
              <div className="max-w-xs space-y-1">
                <p className="font-semibold text-slate-900">For cafes</p>
                <p>
                  List unsold items in minutes, reach students around you, and turn waste
                  into extra revenue.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-lg shadow-emerald-100/60 backdrop-blur">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
              How RescuEat works
            </h2>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <div>
                <p className="font-semibold text-slate-900">For cafes (B2B)</p>
                <p className="mt-1">
                  Create a profile, upload surplus items at the end of the day, set
                  pickup windows, and let students reserve directly in the app.
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">For students (B2C)</p>
                <p className="mt-1">
                  Open the app, browse nearby last-minute deals, reserve a surprise bag
                  or specific item, then pick up on your way home from campus.
                </p>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 text-xs text-slate-500">
              <div className="space-y-1 rounded-2xl border border-emerald-50 bg-emerald-50/60 p-3">
                <dt className="font-medium text-emerald-900">Less waste</dt>
                <dd>Turn leftover pastries, sandwiches, and salads into satisfied customers.</dd>
              </div>
              <div className="space-y-1 rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
                <dt className="font-medium text-slate-900">More access</dt>
                <dd>Make good food accessible for students living on tight budgets.</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="grid gap-6 text-sm md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">
              Built for busy cafe teams
            </h3>
            <ul className="mt-3 space-y-2 text-slate-600">
              <li>• Post surplus in under 2 minutes from phone or tablet.</li>
              <li>• Smart time slots so pickups don&apos;t clash with rush hours.</li>
              <li>• Simple dashboard to track redemptions and extra revenue.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">
              Designed around student life
            </h3>
            <ul className="mt-3 space-y-2 text-slate-600">
              <li>• Map-based view to find deals near campus or your commute.</li>
              <li>• Clear pickup times that fit between lectures and work shifts.</li>
              <li>• Transparent pricing so you always see how much you save.</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
