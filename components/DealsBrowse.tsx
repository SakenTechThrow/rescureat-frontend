"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { apiUrl } from "@/lib/apiBase";

export type DealListItem = {
  id: number;
  title: string;
  description: string;
  restaurantName: string;
  originalPrice: number;
  dealPrice: number;
  district?: string | null;
  nearUniversity?: string | null;
  distanceKm?: number | null;
};

function pickNumber(
  obj: Record<string, unknown>,
  keys: string[],
): number | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "number" && !Number.isNaN(v)) return v;
    if (typeof v === "string") {
      const n = parseFloat(v);
      if (!Number.isNaN(n)) return n;
    }
  }
  return undefined;
}

function pickString(
  obj: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim() !== "") return v;
  }
  return undefined;
}

/** Normalize backend JSON (camelCase or snake_case) into DealListItem. */
export function normalizeDeal(raw: unknown): DealListItem | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = o.id;
  if (typeof id !== "number") return null;
  const title = o.title;
  const restaurantName = o.restaurantName ?? o.restaurant_name;
  if (typeof title !== "string" || typeof restaurantName !== "string") return null;
  const description = typeof o.description === "string" ? o.description : "";
  const originalPrice = pickNumber(o, ["originalPrice", "original_price"]);
  const dealPrice = pickNumber(o, ["dealPrice", "deal_price"]);
  if (originalPrice === undefined || dealPrice === undefined) return null;

  const distanceKm = pickNumber(o, [
    "distanceKm",
    "distance_km",
    "distance",
  ]);

  return {
    id,
    title,
    description,
    restaurantName,
    originalPrice,
    dealPrice,
    district: pickString(o, ["district", "District"]) ?? null,
    nearUniversity: pickString(o, [
      "nearUniversity",
      "near_university",
      "nearUniversityName",
    ]) ?? null,
    distanceKm: distanceKm ?? null,
  };
}

function formatDistance(km: number): string {
  if (km < 1) {
    const m = Math.round(km * 1000);
    return `${m} m away`;
  }
  return `${km.toFixed(1)} km away`;
}

function geolocationErrorMessage(code: number): string {
  switch (code) {
    case 1:
      return "Location access was denied. You can enable it in your browser settings and try again.";
    case 2:
      return "Your position could not be determined. Try again or browse all deals.";
    case 3:
      return "Location request timed out. Try again.";
    default:
      return "Could not get your location. Try again.";
  }
}

type DealsBrowseProps = {
  initialDeals: DealListItem[];
};

export default function DealsBrowse({ initialDeals }: DealsBrowseProps) {
  const [allDeals] = useState<DealListItem[]>(initialDeals);
  const [sourceDeals, setSourceDeals] = useState<DealListItem[]>(initialDeals);
  const [nearbyMode, setNearbyMode] = useState(false);

  const [district, setDistrict] = useState<string>("");
  const [university, setUniversity] = useState<string>("");

  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const districtOptions = useMemo(() => {
    const set = new Set<string>();
    for (const d of sourceDeals) {
      if (d.district) set.add(d.district);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [sourceDeals]);

  const universityOptions = useMemo(() => {
    const set = new Set<string>();
    for (const d of sourceDeals) {
      if (d.nearUniversity) set.add(d.nearUniversity);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [sourceDeals]);

  const filteredDeals = useMemo(() => {
    return sourceDeals.filter((deal) => {
      if (district && deal.district !== district) return false;
      if (university && deal.nearUniversity !== university) return false;
      return true;
    });
  }, [sourceDeals, district, university]);

  const fetchNearby = useCallback(() => {
    setLocationError(null);
    setNearbyLoading(true);

    if (!navigator.geolocation) {
      setLocationError("Your browser does not support location.");
      setNearbyLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        try {
          const url = new URL(apiUrl("/api/deals/nearby"));
          url.searchParams.set("lat", String(lat));
          url.searchParams.set("lng", String(lng));
          url.searchParams.set("radiusKm", "5");

          const res = await fetch(url.toString(), { cache: "no-store" });
          if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Failed to load nearby deals");
          }
          const json: unknown = await res.json();
          const list = Array.isArray(json) ? json : [];
          const normalized = list
            .map(normalizeDeal)
            .filter((x): x is DealListItem => x !== null);

          setSourceDeals(normalized);
          setNearbyMode(true);
          setDistrict("");
          setUniversity("");
        } catch (e) {
          setLocationError(
            e instanceof Error ? e.message : "Failed to load nearby deals",
          );
        } finally {
          setNearbyLoading(false);
        }
      },
      (err) => {
        setNearbyLoading(false);
        setLocationError(geolocationErrorMessage(err.code));
      },
      { enableHighAccuracy: false, timeout: 15_000, maximumAge: 60_000 },
    );
  }, []);

  function showAllDeals() {
    setSourceDeals(allDeals);
    setNearbyMode(false);
    setDistrict("");
    setUniversity("");
    setLocationError(null);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={fetchNearby}
            disabled={nearbyLoading}
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {nearbyLoading ? "Finding deals near you…" : "Use my location"}
          </button>
          {nearbyMode ? (
            <button
              type="button"
              onClick={showAllDeals}
              className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-50"
            >
              Show all deals
            </button>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div>
            <label
              htmlFor="filter-district"
              className="block text-xs font-medium uppercase tracking-wide text-slate-500"
            >
              District
            </label>
            <select
              id="filter-district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="mt-1 w-full min-w-[10rem] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:w-auto"
            >
              <option value="">All districts</option>
              {districtOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="filter-university"
              className="block text-xs font-medium uppercase tracking-wide text-slate-500"
            >
              University
            </label>
            <select
              id="filter-university"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="mt-1 w-full min-w-[10rem] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:w-auto"
            >
              <option value="">All universities</option>
              {universityOptions.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {locationError ? (
        <div
          className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          role="alert"
        >
          {locationError}
        </div>
      ) : null}

      <p className="mt-4 text-sm text-slate-600">
        {nearbyMode
          ? "Showing deals within 5 km of your location."
          : "Showing all deals from the server."}
        {filteredDeals.length !== sourceDeals.length
          ? ` (${filteredDeals.length} match your filters.)`
          : null}
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDeals.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-10 text-center text-sm text-slate-600">
            {sourceDeals.length === 0 ? (
              <>
                No deals available right now. Try{" "}
                <button
                  type="button"
                  onClick={fetchNearby}
                  disabled={nearbyLoading}
                  className="font-semibold text-emerald-700 underline hover:text-emerald-800 disabled:opacity-50"
                >
                  use my location
                </button>{" "}
                to search nearby, or check back later.
              </>
            ) : (
              <>
                No deals match your filters. Try clearing filters or{" "}
                <button
                  type="button"
                  onClick={showAllDeals}
                  className="font-semibold text-emerald-700 underline hover:text-emerald-800"
                >
                  show all deals
                </button>
                .
              </>
            )}
          </div>
        ) : (
          filteredDeals.map((deal) => (
            <Link
              key={deal.id}
              href={`/deals/${deal.id}`}
              className="flex flex-col rounded-2xl border border-slate-200 p-5 shadow-sm transition hover:shadow-md"
            >
              <p className="text-sm font-medium text-emerald-600">
                {deal.restaurantName}
              </p>

              <h2 className="mt-2 text-xl font-semibold text-slate-900">
                {deal.title}
              </h2>

              {deal.distanceKm != null ? (
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {formatDistance(deal.distanceKm)}
                </p>
              ) : null}

              <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                {deal.description}
              </p>

              <div className="mt-4 flex items-center gap-3">
                <span className="text-sm text-slate-400 line-through">
                  ${deal.originalPrice.toFixed(2)}
                </span>
                <span className="text-lg font-bold text-emerald-600">
                  ${deal.dealPrice.toFixed(2)}
                </span>
              </div>

              <div className="mt-5 inline-block rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white">
                View deal
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
