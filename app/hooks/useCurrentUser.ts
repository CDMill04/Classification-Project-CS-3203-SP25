"use client";

import { useState, useEffect } from "react";

type User = {
  name: string;
  email: string;
} | null;

export default function useCurrentUser() {
  const [user, setUser] = useState<User>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
      }
    }
  }, []);

  return { user, setUser, isMounted };
}