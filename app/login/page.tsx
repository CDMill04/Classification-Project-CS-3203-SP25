'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect back to dashboard
    router.push("/");
  }, [router]);

  return null; // optional: or a loading spinner
}