'use client';

import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { X } from "lucide-react";

interface SignUpModalProps {  // Same as login, controls if the page is open or not
  isOpen: boolean;
  onClose: () => void;
  openLogin: () => void;
}

export default function SignUpModal({ isOpen, onClose, openLogin }: SignUpModalProps) {
  const [name, setName] = useState('');  // These fields are for entering email and confirming password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');   // Throw an error if there is one

  if (!isOpen) return null; // Ensure the screen is actually open

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {    // Handle password mismatch
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Log values to send to API
    console.log('Sign Up Data:', { name, email, password }); 

    onClose(); // Close after successful signup
  };

  return (    // UI area, handle this how you want Ethan
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
        <form className="space-y-6" onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Confirm Password</label>
            <Input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-lg"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-[hsl(var(--primary))] text-white rounded-lg hover:opacity-90"
          >
            Create Account
          </Button>
        </form>
        <div className="text-center mt-6">
  <p className="text-sm text-muted-foreground">
    Already have an account?{" "}
    <button
      type="button"
      onClick={() => {
        onClose();    // Close sign up modal
        openLogin();  // Open login modal
      }}
      className="text-[hsl(var(--primary))] hover:underline"
    >
      Log In
    </button>
    </p>
    </div>
    </div>
    </div>
  );
}
