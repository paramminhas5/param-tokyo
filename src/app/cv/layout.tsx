import type { Metadata } from "next";
import { HERO } from "@/content/resume";

// Metadata must come from a server component. The CV page itself is a client
// component (it triggers the print dialog), so the route metadata lives here.
export const metadata: Metadata = {
  title: "CV",
  description: `${HERO.name} — full CV. ${HERO.tagline}`,
};

export default function CvLayout({ children }: { children: React.ReactNode }) {
  return children;
}
