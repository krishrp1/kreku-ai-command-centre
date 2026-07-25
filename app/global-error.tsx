"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary — only fires if the root layout itself throws, so it
 * can't assume providers, fonts, or Tailwind ever mounted. Deliberately
 * plain, inline-styled markup only.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled root-layout error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#05060a",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Something glitched</h1>
          <p style={{ marginTop: "0.5rem", color: "rgba(255,255,255,0.65)" }}>
            The application hit an unexpected fault. It&apos;s been logged — try again.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              padding: "0.5rem 1.25rem",
              borderRadius: "0.5rem",
              border: "1px solid rgba(0,229,255,0.4)",
              background: "rgba(0,229,255,0.1)",
              color: "#00e5ff",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
