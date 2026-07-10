// qup-dating/src/app/verify/page.js
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// EMAIL_VERIFY_PAGE_V1 — the address LocalPulse verification emails link to.
// Keeping the link on qup.dating (rather than the raw API host) means the
// sending domain and the click destination match, which is what Google Safe
// Browsing wants to see. The page reads ?token= from the URL, calls the API,
// and shows a human-readable result instead of raw JSON.
//
// Set NEXT_PUBLIC_API_URL in the deployment env, e.g.
//   NEXT_PUBLIC_API_URL=https://orca-app-3iy6i.ondigitalocean.app
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://lionfish-app-ed6lo.ondigitalocean.app";

// STATUS_V1 — "loading" | "success" | "expired" | "invalid" | "error"
function VerifyInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    // STRICT_MODE_GUARD_V1 — React 18 dev StrictMode double-invokes effects.
    // The verify endpoint is single-use, so a second call would report the
    // token as already consumed. `cancelled` discards the stale response.
    let cancelled = false;

    const run = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/auth/verify/${encodeURIComponent(token)}`,
          { method: "GET", headers: { Accept: "application/json" } },
        );

        // The API may return a non-JSON body on 5xx; guard the parse.
        let body = null;
        try {
          body = await res.json();
        } catch {
          body = null;
        }

        if (cancelled) return;

        if (res.ok) {
          setStatus("success");
          setMessage(body?.message ?? null);
          return;
        }

        if (res.status === 410 || body?.error === "expired") {
          setStatus("expired");
          setMessage(body?.message ?? null);
          return;
        }

        if (res.status === 400 || res.status === 404) {
          setStatus("invalid");
          setMessage(body?.message ?? null);
          return;
        }

        setStatus("error");
        setMessage(body?.message ?? null);
      } catch (e) {
        if (cancelled) return;
        // eslint-disable-next-line no-console
        console.error("[verify] request failed", e);
        setStatus("error");
        setMessage(null);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const COPY = {
    loading: {
      icon: null,
      title: "Verifiserer …",
      body: "Vent litt mens vi bekrefter e-postadressen din.",
    },
    success: {
      icon: "✓",
      iconColor: "#1f9d6b",
      title: "E-posten er bekreftet",
      body: "Du kan nå logge inn i LocalPulse-appen.",
    },
    expired: {
      icon: "!",
      iconColor: "#d97706",
      title: "Lenken har utløpt",
      body: "Be om en ny bekreftelseslenke i appen, og prøv igjen.",
    },
    invalid: {
      icon: "✕",
      iconColor: "#dc2626",
      title: "Ugyldig lenke",
      body: "Denne lenken er ikke gyldig. Sjekk at du åpnet hele lenken fra e-posten.",
    },
    error: {
      icon: "✕",
      iconColor: "#dc2626",
      title: "Noe gikk galt",
      body: "Vi klarte ikke å bekrefte e-posten din nå. Prøv igjen om litt.",
    },
  };

  const c = COPY[status] ?? COPY.error;

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "#f7f8fa",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          borderRadius: 16,
          padding: "40px 32px",
          textAlign: "center",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        {status === "loading" ? (
          <div
            aria-hidden="true"
            style={{
              width: 40,
              height: 40,
              margin: "0 auto 20px",
              borderRadius: "50%",
              border: "3px solid #e5e7eb",
              borderTopColor: "#6b7280",
              animation: "verify-spin 0.8s linear infinite",
            }}
          />
        ) : (
          <div
            aria-hidden="true"
            style={{
              width: 56,
              height: 56,
              margin: "0 auto 20px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
              color: "#fff",
              background: c.iconColor,
            }}
          >
            {c.icon}
          </div>
        )}

        <h1
          style={{
            margin: "0 0 10px",
            fontSize: 22,
            fontWeight: 700,
            color: "#111827",
            lineHeight: 1.3,
          }}
        >
          {c.title}
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: 14,
            color: "#6b7280",
            lineHeight: 1.6,
          }}
        >
          {message ?? c.body}
        </p>

        {status === "success" && (
          <p
            style={{
              margin: "24px 0 0",
              fontSize: 13,
              color: "#9ca3af",
              lineHeight: 1.5,
            }}
          >
            Du kan lukke dette vinduet.
          </p>
        )}
      </div>

      <style>{`
        @keyframes verify-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}

// SUSPENSE_BOUNDARY_V1 — useSearchParams() opts the subtree into client-side
// rendering and Next requires a Suspense boundary around it, otherwise the
// whole route deopts to dynamic rendering at build time.
export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyInner />
    </Suspense>
  );
}