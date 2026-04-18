/**
 * Central mock data for the RescuEat MVP.
 *
 * Contains:
 * - Deals data (for /deals and /deals/[id])
 * - Cafe listings data (for /dashboard/cafe)
 * - Dashboard summary mock data (summary cards on /dashboard/cafe)
 *
 * All pages that need this data import from here—no inline mock data in pages.
 */

export type Deal = {
  id: number;
  cafe: string;
  title: string;
  originalPrice: string;
  discountedPrice: string;
  pickupTime: string;
  pickupDeadline: string;
  description: string;
};

export const deals: Deal[] = [
  {
    id: 1,
    cafe: "Campus Corner Cafe",
    title: "Evening pastry box",
    originalPrice: "€10.00",
    discountedPrice: "€4.00",
    pickupTime: "Pick up today · 19:00–20:00",
    pickupDeadline: "Pick up today before 20:00",
    description:
      "A mix of today's leftover croissants, muffins, and pastries. Perfect for sharing or saving for breakfast.",
  },
  {
    id: 2,
    cafe: "Green Bean Roastery",
    title: "Surplus sandwiches",
    originalPrice: "€8.50",
    discountedPrice: "€3.20",
    pickupTime: "Pick up today · 18:30–19:15",
    pickupDeadline: "Pick up today before 19:15",
    description:
      "Fresh sandwiches that didn't sell during the afternoon rush, packed and ready to go.",
  },
  {
    id: 3,
    cafe: "Library Lounge",
    title: "Surprise dinner bowl",
    originalPrice: "€11.90",
    discountedPrice: "€4.90",
    pickupTime: "Pick up today · 20:00–20:30",
    pickupDeadline: "Pick up today before 20:30",
    description:
      "A warm, hearty bowl using today's remaining ingredients. Vegetarian-friendly options most days.",
  },
  {
    id: 4,
    cafe: "City Bakehouse",
    title: "Mixed bread bag",
    originalPrice: "€7.00",
    discountedPrice: "€2.80",
    pickupTime: "Pick up today · 19:30–20:00",
    pickupDeadline: "Pick up today before 20:00",
    description:
      "A selection of breads and rolls from today's bakes. Great for freezing or sharing with friends.",
  },
  {
    id: 5,
    cafe: "Late Night Bites",
    title: "Leftover slices & sides",
    originalPrice: "€9.50",
    discountedPrice: "€3.90",
    pickupTime: "Pick up today · 21:00–21:30",
    pickupDeadline: "Pick up today before 21:30",
    description:
      "Pizza slices and side dishes that are still fresh but won't be sold after closing.",
  },
  {
    id: 6,
    cafe: "Garden Deli",
    title: "Salad & wrap combo",
    originalPrice: "€12.40",
    discountedPrice: "€5.20",
    pickupTime: "Pick up today · 18:45–19:15",
    pickupDeadline: "Pick up today before 19:15",
    description:
      "One fresh salad and one wrap made with today's ingredients, at an end-of-day price.",
  },
];

export type CafeListing = {
  id: number;
  title: string;
  status: string;
  portionsLeft: number;
  pickupWindow: string;
};

/** Dashboard summary mock data: the three cards at the top of the cafe dashboard. */
export type SummaryCard = {
  label: string;
  value: string;
};

export const cafeSummaryCards: SummaryCard[] = [
  { label: "Active Listings", value: "4" },
  { label: "Reserved Today", value: "12" },
  { label: "Total Savings", value: "€86" },
];

export const cafeListings: CafeListing[] = [
  {
    id: 1,
    title: "Evening pastry box",
    status: "Active",
    portionsLeft: 5,
    pickupWindow: "Today · 19:00–20:00",
  },
  {
    id: 2,
    title: "Surplus sandwiches",
    status: "Active",
    portionsLeft: 3,
    pickupWindow: "Today · 18:30–19:15",
  },
  {
    id: 3,
    title: "Mixed bread bag",
    status: "Scheduled",
    portionsLeft: 10,
    pickupWindow: "Tomorrow · 19:30–20:00",
  },
];
