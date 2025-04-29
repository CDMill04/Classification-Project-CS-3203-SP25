"use client";
import { useEffect } from "react";

/* ──────────── configuration interface ──────────── */
export interface GuardOptions {
  /** Origins that may embed or navigate to this page */
  allowList?: string[];
  /** If true, a missing referrer is treated as OK (typed URL / bookmark) */
  allowEmptyReferrer?: boolean;
  /** Hook to run when the check fails */
  onBlock?: (info: { referrer: string | null }) => void;
}

/* ──────────────── tiny helper ──────────────── */
function runGuard({
  allowList = [location.origin],
  allowEmptyReferrer = true,
  onBlock = ({ referrer }) => {
    document.documentElement.innerHTML =
      "<h1 style='font-family:system-ui;margin:2rem'>Access denied</h1>";
    navigator.sendBeacon?.("/api/bad-referrer", JSON.stringify({ referrer }));
  },
}: GuardOptions = {}) {
  const ref = document.referrer || null;

  if (!ref && allowEmptyReferrer) return; // ✅ bookmark / direct nav
  let refOrigin = "";
  try {
    refOrigin = new URL(ref!).origin;
  } catch {
    /* malformed referrer – treat as hostile */
  }
  if (allowList.includes(refOrigin)) return; // ✅ good origin
  onBlock({ referrer: ref });                // 🚫 stop right there
}

/* ───────────── component you import ───────────── */
export function OriginGuard(opts?: GuardOptions) {
  useEffect(() => runGuard(opts), [opts]);
  return null;           // renders nothing
}
