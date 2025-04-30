'use client';

import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // This is a set of invalid inputs
    const hasScript = /<script.*?>.*?<\/script>/gi;

    if (!name || !email || !password) {
      setError("Please fill out all fields.");
      setLoading(false);
      return;
    }

    if (!emailRegex.test(email)) { // Make sure the email is not an attack
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (hasScript.test(name) || hasScript.test(email) || hasScript.test(password)) { // Make sure there is no attempted script injection
      setError("Input contains restricted content.");
      setLoading(false);
      return;
    }

    if (name.length > 100) { // Set a basic max name length
      setError("Name is too long.");
      setLoading(false);
      return;
    }

    if (password.length < 6 || password.length > 100) { // Finally, have a basic password security check
      setError("Password must be between 6 and 100 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: "None", school: "None" }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed.");
        setLoading(false);
        return;
      }

      console.log("Account created successfully:", data);
      router.push('/login'); // After signup, go back to login page
    } catch (err) {
      console.error(err);
      setError("Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--primary))]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-6 text-[hsl(var(--primary))] uppercase">
          Create Account
        </h1>

        <form className="space-y-6" onSubmit={handleSignUp}>
          <div>
            <label className="block mb-2 text-sm font-medium">Name</label>
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg"
            />
          </div>
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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full bg-[hsl(var(--primary))] text-white rounded-lg hover:opacity-90" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-[hsl(var(--primary))] hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
