'use client';

import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { X } from "lucide-react"; // Quick swap this for anything you want Ethan

interface LoginModalProps {  // This is simply the call and the variables that control if it is open or if it should close
  isOpen: boolean;
  onClose: () => void;
  openSignUp: () => void;
}

export default function LoginModal({ isOpen, onClose, openSignUp }: LoginModalProps) {
  const [email, setEmail] = useState('');   // Accept email and password
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');   // If they do not match, throw error

  if (!isOpen) return null; // Don't render anything if it's not open

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (email === "test@example.com" && password === "password123") {   //Handle some email and password
      console.log("Logged in successfully!");
      onClose(); // Close modal after successful login
    } else {
      setError("Invalid email or password.");    // Throw error otherwise
    }
  };

  return (   //This is all the UI. I tried to make it a semi transparent screen with the next few lines
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>
        <h2 className="text-3xl font-bold text-center mb-6 text-[hsl(var(--primary))] uppercase">
          Login
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
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
          <Button
            type="submit"
            className="w-full bg-[hsl(var(--primary))] text-white rounded-lg hover:opacity-90"
          >
            Log In
          </Button>
        </form>
        <div className="text-center mt-6">
  <p className="text-sm text-muted-foreground">
    New?{" "}
    <button
      type="button"
      onClick={() => {
        onClose(); // Close login modal
        openSignUp(); // Export the sign up button
      }}
      className="text-[hsl(var(--primary))] hover:underline"
    >
      Create an account
        </button>
        </p>
        </div>
      </div>
    </div>
  );
}
