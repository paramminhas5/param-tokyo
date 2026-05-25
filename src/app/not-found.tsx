import Link from "next/link";

export default function NotFound() {
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
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "4rem", fontFamily: "var(--font-mono)", color: "#fbbf24" }}>404</h1>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(240,236,228,0.6)",
            marginTop: 12,
          }}
        >
          World not found
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            marginTop: 24,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#fbbf24",
            border: "2px solid #fbbf24",
            padding: "10px 20px",
            textDecoration: "none",
          }}
        >
          ← Back to start
        </Link>
      </div>
    </div>
  );
}
