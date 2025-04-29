'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useSessionTimeout() {
  const router = useRouter();

  useEffect(() => {
    const storedTime = localStorage.getItem('loginTime'); // This function tracks how long a user is logged in
    if (storedTime) {
      const loginTime = parseInt(storedTime, 10); // If they are logged in for more than ten hours, we want to log them out
      const now = Date.now();
      const hoursPassed = (now - loginTime) / (1000 * 60 * 60); // ms to hours

      if (hoursPassed >= 10) { // Log the user out and let them know
        console.log("Session expired, logging out.");
        localStorage.removeItem('user');
        localStorage.removeItem('loginTime');
        localStorage.setItem('logoutSuccess', 'true');
        router.push('/dashboard');
      }
    }
  }, [router]);
}
