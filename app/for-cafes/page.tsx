export default function ForCafesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-emerald-50 to-white px-4 py-12 md:py-16">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            For Cafes
          </h1>
          <p className="max-w-2xl text-sm text-slate-600">
            RescuEat helps you turn today&apos;s unsold food into extra revenue and new
            regulars, instead of waste. This page is a simple placeholder to show
            how cafes will work with the platform in the MVP.
          </p>
        </header>

        <section className="space-y-4 rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            How you&apos;ll list surplus food
          </h2>
          <ol className="space-y-2 text-sm text-slate-600">
            <li>
              <span className="font-medium text-slate-900">1. Create a cafe profile</span>{" "}
              – add your logo, address, opening hours, and a short description.
            </li>
            <li>
              <span className="font-medium text-slate-900">
                2. Add surplus items at the end of the day
              </span>{" "}
              – choose what&apos;s left (sandwiches, pastries, salads, etc.) and group
              them into a simple deal.
            </li>
            <li>
              <span className="font-medium text-slate-900">
                3. Set a discounted price and pickup window
              </span>{" "}
              – students see how much they save and when to collect their food.
            </li>
            <li>
              <span className="font-medium text-slate-900">
                4. Students reserve and show a code at pickup
              </span>{" "}
              – you quickly confirm the order at the counter and hand over the bag.
            </li>
          </ol>
        </section>

        <section className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Why join RescuEat as a cafe?
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>Earn extra revenue from food that would normally be thrown away.</li>
            <li>Reach nearby students who are looking for affordable options.</li>
            <li>Show that you care about food waste and the local community.</li>
            <li>Keep the workflow simple for your team, even during busy evenings.</li>
          </ul>
        </section>

        <section className="flex flex-col items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-600 px-5 py-6 text-white shadow-sm">
          <div>
            <h2 className="text-sm font-semibold">Ready to list your surplus?</h2>
            <p className="mt-1 text-sm text-emerald-50">
              This is a placeholder CTA for the MVP. In the live product, this button
              could open a simple onboarding flow for cafes.
            </p>
          </div>
          <button
            type="button"
            className="mt-1 inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-xs font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-600 focus-visible:ring-white"
          >
            Start listing
          </button>
        </section>
      </div>
    </main>
  );
}

