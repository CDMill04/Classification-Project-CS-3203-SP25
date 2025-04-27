'use client';

import Layout from "@/app/components/Layout";
import Link from "next/link";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

export default function SignupPage() {
  return (
    <Layout className="bg-[hsl(var(--primary))]">
      <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--primary))]">
        <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-lg border">
          <h1 className="text-3xl font-bold text-center mb-6 text-[hsl(var(--primary))]">
            Create an Account
          </h1>
          <form className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium">Name</label>
              <Input
                type="text"
                placeholder="Enter your full name"
                className="rounded-lg"
              />
            </div>
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
                placeholder="Create a password"
                className="rounded-lg"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[hsl(var(--primary))] text-white rounded-lg hover:opacity-90"
            >
              Sign Up
            </Button>
          </form>
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-[hsl(var(--primary))] hover:underline">
                Log in here!
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}