import { AgeGate } from "@/components/age-gate";
import { site } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Adults only — ${site.name}`,
  description: "Adults-only website. You must be 18 or older to enter.",
};

export default function AgeGatePage() {
  return <AgeGate />;
}
