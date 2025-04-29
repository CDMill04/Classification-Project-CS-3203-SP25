'use client';

import { useState } from "react";
import { Input } from "@/app/components/ui/input";   // Import UI
import { Button } from "@/app/components/ui/button";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface LoginModalProps {   // This is all of our props that are created with this modal
  isOpen: boolean;
  onClose: () => void;
  openSignUp: () => void;
  onLoginSuccess: () => void;  // This is the function that will be called when the user successfully logs in
}

export default function LoginModal({ isOpen, onClose, openSignUp, onLoginSuccess }: LoginModalProps) {  // Prepare to recieve email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');    // Prep errors
  const [loading, setLoading] = useState(false);   // Loading times because we're fancy

  if (!isOpen) return null;   // If it aint open, dont use it

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {   // Set up try/catch block
    e.preventDefault();
    setError('');
    setLoading(true);

    try { // Try to recieve user info
      const res = await fetch('/api/users');
      const users = await res.json();

      const foundUser = users.find(   // Once we've got it, search the database for the login
        (user: any) => user.email === email && user.password === password
      );

      if (foundUser) {     // Find login and tell the user 
        console.log("Login successful for:", foundUser.name);
        localStorage.setItem('user', JSON.stringify(foundUser));
        onClose();
        onLoginSuccess();   // Call the function to update the UI
        // We could also optionally reload the page here if needed
      } else {
        setError("Invalid email or password.");  // Catch errors
      }
    } catch (err) {
      console.error(err);
      setError("Login failed.");   // If there is an error, tell them
    } finally {
      setLoading(false);
    }
  };

  return (   // UI 
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y:50 }}
        animate={{ opacity: 1, y:0 }}
        exit={{ opacity: 0, y:50 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold text-center mb-6 text-[hsl(var(--primary))] uppercase">
          Login
        </h2>

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

          <Button
            type="submit"
            className="w-full bg-[hsl(var(--primary))] text-white rounded-lg hover:opacity-90"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            New?{" "}
            <button
              type="button"
              onClick={() => {
                onClose();
                openSignUp();
              }}
              className="text-[hsl(var(--primary))] hover:underline"
            >
              Create an account
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}