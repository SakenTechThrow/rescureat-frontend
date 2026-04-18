"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRole, getToken } from "@/lib/auth";

export default function CafeDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    const role = getRole();

    if (!token) {
      router.replace("/login");
      return;
    }

    if (role !== "CAFE_OWNER") {
      router.replace("/deals");
      return;
    }

    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-gradient-to-b from-emerald-50 via-white to-emerald-100 px-4 py-16">
        <p className="text-sm text-slate-600">Checking access…</p>
      </div>
    );
  }

  return <>{children}</>;
}
