"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "#050310",
        color: "#f0ece4",
        padding: "0 16px",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <h1
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 14,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#ff6b5b",
          }}
        >
          LOAD ERROR
        </h1>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "rgba(240,236,228,0.5)",
            marginTop: 12,
          }}
        >
          {error.message}
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 24 }}>
          <button
            onClick={reset}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              background: "#fbbf24",
              color: "#050310",
              border: "none",
              padding: "10px 16px",
              cursor: "pointer",
            }}
          >
            RETRY
          </button>
          <a
            href="/"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#f0ece4",
              border: "1px solid rgba(240,236,228,0.3)",
              padding: "10px 16px",
              textDecoration: "none",
            }}
          >
            HOME
          </a>
        </div>
      </div>
    </div>
  );
}
