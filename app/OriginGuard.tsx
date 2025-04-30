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

  if (!ref && allowEmptyReferrer) return; // bookmark / direct nav
  let refOrigin = "";
  try {
    refOrigin = new URL(ref!).origin;
  } catch {
    console.warn("Blocked: Malformed referrer", ref);
    onBlock({ referrer: ref });
    return;
  }

  if (allowList.includes(refOrigin)) {
    console.log("Allowed referrer:", refOrigin);
    return;
  }

  console.warn("Blocked referrer:", refOrigin);
  onBlock({ referrer: ref });
}

/* ───────────── component you import ───────────── */
export function OriginGuard(opts?: GuardOptions) {
  useEffect(() => runGuard(opts), [opts]);
  return null;           // renders nothing
}
