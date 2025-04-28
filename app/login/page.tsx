'use client';

import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {   // This is much like the login modal. This time, its a page
  const router = useRouter();    // Get a router for the database

  const [email, setEmail] = useState('');   // Prepare for information and possibly errors
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {    // The user should be aware they have to fill out both fields
      setError("Please fill out both fields.");
      setLoading(false);
      return;
    }

    try {    // Try to see if there is a login for those credentials
      const res = await fetch('/api/users');
      const users = await res.json();

      const foundUser = users.find( 
        (user: any) => user.email === email && user.password === password
      );

      if (foundUser) {   // User has been located 
        console.log("Login successful for:", foundUser.name);
        localStorage.setItem('user', JSON.stringify(foundUser));
        router.push('/'); // Redirect to dashboard or home
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {   // Otherwise, tell them
      console.error(err);
      setError("Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return ( // UI
    <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--primary))]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-6 text-[hsl(var(--primary))] uppercase">
          Classification
        </h1>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block mb-2 text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Password</label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full bg-[hsl(var(--primary))] text-white rounded-lg hover:opacity-90" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            New here?{" "}
            <Link href="/signup" className="text-[hsl(var(--primary))] hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}