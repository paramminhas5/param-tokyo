import type { Metadata } from "next";
import { HERO } from "@/content/resume";

export const metadata: Metadata = {
  title: "CV",
  description: `${HERO.name} — printable resume`,
};

export default function CvLayout({ children }: { children: React.ReactNode }) {
  return children;
}
