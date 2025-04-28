'use client';

import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { X } from "lucide-react";

interface SignUpModalProps {    // Set all props up
  isOpen: boolean;
  onClose: () => void;
  openLogin: () => void;
}

export default function SignUpModal({ isOpen, onClose, openLogin }: SignUpModalProps) {  // Prep to recieve info
  const [name, setName] = useState('');   // This time we include a name
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');   // Prepare for errors and loading
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;  // Do not render if not open

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {  // Try catch for sign ups
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name || !email || !password) {   // If they fail to fill out all fields, let em know
      setError("Please fill out all fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/users', {   // Try to create a login
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();   // See if it worked

      if (!res.ok) {
        setError(data.error || "Signup failed.");   // Let them know if it didnt
        setLoading(false);
        return;
      }

      console.log("Account created successfully:", data);   // If it did, hooray!
      onClose();
      openLogin(); // Go back to login modal after successful signup
    } catch (err) {
      console.error(err);
      setError("Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return ( // UI stuff
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold text-center mb-6 text-[hsl(var(--primary))] uppercase">
          Sign Up
        </h2>

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

          <Button
            type="submit"
            className="w-full bg-[hsl(var(--primary))] text-white rounded-lg hover:opacity-90"
            disabled={loading}
          >
            {loading ? "Creating..." : "Sign Up"}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                onClose();
                openLogin();
              }}
              className="text-[hsl(var(--primary))] hover:underline"
            >
              Log in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}