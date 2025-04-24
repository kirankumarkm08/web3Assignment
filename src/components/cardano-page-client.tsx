"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

// Dynamically import the Dashboard component with no SSR
const DynamicDashboard = dynamic(
  () => import("@/components/cardanoDashboard"),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading Cardano wallet integration...</span>
      </div>
    ),
  }
);

export default function CardanoPageClient() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <DynamicDashboard />
    </Suspense>
  );
}
