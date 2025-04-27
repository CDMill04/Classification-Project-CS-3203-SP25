'use client';

import Layout from "@/app/components/Layout";
import Link from "next/link";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

export default function LoginPage() {
  return (
    <Layout className="bg-[hsl(var(--primary))]">
      <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--primary))]">
        <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-lg border">
        <h1 className="text-4xl font-bold text-center mb-6 text-[hsl(var(--primary))] uppercase tracking-wide">
            CLASSIFICATION
          </h1>
          <form className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                className="rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                className="rounded-lg"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[hsl(var(--primary))] text-white rounded-lg hover:opacity-90"
            >
              Log In
            </Button>
          </form>
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <Link href="/signup" className="text-[hsl(var(--primary))] hover:underline">
                Sign up instead!
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}