"use client";

import Link from "next/link";
import { useEffect } from "react";
import { HERO, CHAPTERS, SKILL_GROUPS, PRESS } from "@/content/resume";

/**
 * Printable CV. Auto-opens the print dialog so "Save as PDF" is one click away.
 * The richer Olly-Moss-poster redesign lands in PR 5 — this is the migration port.
 */
export default function CvPage() {
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        window.print();
      } catch {
        /* noop */
      }
    }, 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="no-print fixed top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
        <Link
          href="/"
          className="px-3 py-2 text-white hover:bg-[#ec4899] transition-colors"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            background: "#15131c",
          }}
        >
          ← BACK
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="px-3 py-2 transition-colors"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            background: "#ec4899",
            color: "white",
          }}
        >
          ⬇ SAVE AS PDF
        </button>
      </div>

      <main className="mx-auto max-w-3xl px-8 py-12 sm:py-16">
        {/* Header */}
        <header className="border-b-2 border-black pb-5">
          <h1
            className="text-2xl sm:text-3xl tracking-tight"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.02em" }}
          >
            {HERO.name}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-700">{HERO.tagline}</p>
          <p className="mt-1 text-xs sm:text-sm text-neutral-600">{HERO.bio}</p>
          <p className="mt-3 text-xs text-neutral-600">
            {HERO.email} · {HERO.location}
            <br />
            {HERO.links.linkedin} · {HERO.links.twitter} · {HERO.links.site}
          </p>
        </header>

        {/* Highlights */}
        <section className="mt-6">
          <h2
            className="mb-3 text-neutral-800"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            ▸ HIGHLIGHTS
          </h2>
          <ul className="grid grid-cols-3 gap-2">
            {HERO.stats.map((s) => (
              <li key={s.label} className="border border-neutral-300 px-2 py-2">
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700 }}>{s.value}</div>
                <div className="text-[10px] text-neutral-600 mt-0.5">{s.label}</div>
              </li>
            ))}
          </ul>
        </section>

        {/* Experience */}
        <section className="mt-7">
          <h2
            className="mb-3 text-neutral-800"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            ▸ EXPERIENCE
          </h2>
          <ol className="space-y-5">
            {CHAPTERS.map((c) => (
              <li key={c.id} className="border-l-2 border-black pl-4">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span
                    className="text-neutral-500"
                    style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
                  >
                    {c.year}
                  </span>
                  <span className="font-bold">{c.org}</span>
                  <span className="text-sm text-neutral-700">· {c.role}</span>
                </div>
                <p className="mt-1 text-sm text-neutral-800">{c.hook}</p>
                <ul className="mt-2 text-sm text-neutral-700 list-disc pl-5 space-y-1">
                  {c.paragraphs.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
                {c.outcomes.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {c.outcomes.map((o) => (
                      <span
                        key={o}
                        className="px-1.5 py-0.5 border border-neutral-400"
                        style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}
                      >
                        {o}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* Skills */}
        <section className="mt-7">
          <h2
            className="mb-3 text-neutral-800"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            ▸ SKILLS
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {SKILL_GROUPS.map((g) => (
              <div key={g.title}>
                <div
                  className="mb-1"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  {g.title}
                </div>
                <p className="text-xs text-neutral-700">{g.items.join(" · ")}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Press */}
        <section className="mt-7">
          <h2
            className="mb-3 text-neutral-800"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            ▸ SELECTED PRESS
          </h2>
          <ul className="text-sm space-y-1">
            {PRESS.map((p) => (
              <li key={p.title}>
                <span className="font-bold">{p.outlet}</span> · {p.title}
              </li>
            ))}
          </ul>
        </section>

        {/* Education */}
        <section className="mt-7">
          <h2
            className="mb-3 text-neutral-800"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            ▸ EDUCATION
          </h2>
          <p className="text-sm">
            Bachelor of Engineering, Computer Science · Bangalore Institute of Technology
            <br />
            <span className="text-neutral-600 text-xs">Supplemented by 15 years of shipping.</span>
          </p>
        </section>

        <footer
          className="mt-10 pt-5 border-t border-neutral-300 text-[10px] text-neutral-500"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {HERO.name} · {HERO.email} · {new Date().getFullYear()}
        </footer>
      </main>
    </div>
  );
}
