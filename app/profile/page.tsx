'use client';

import { useState, useEffect } from "react";
import Layout from "@/app/components/Layout";
import { Button } from "@/app/components/ui/button";
import LoginModal from "@/app/components/modals/loginPage";
import SignUpModal from "@/app/components/modals/SignUpPage";

export default function Profile() {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openLogin = () => {
    setLoginOpen(true);
    setSignUpOpen(false);
  };

  const openSignUp = () => {
    setLoginOpen(false);
    setSignUpOpen(true);
  };

  const closeAllModals = () => {
    setLoginOpen(false);
    setSignUpOpen(false);
  };

  return (
    <Layout>
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-20 flex justify-between items-center p-4 bg-background border-b">
        <h2 className="text-2xl font-bold">Profile</h2>
        <Button
          onClick={openLogin}
          className="bg-[hsl(var(--primary))] text-white hover:opacity-90 rounded-lg"
        >
          Log In
        </Button>
      </div>

      {/* Page Content */}
      <div className="p-6 mt-6">
        <h2 className="text-2xl font-bold mb-6">User Profile</h2>
        <p className="text-muted-foreground mb-8">
          Manage your personal information and settings.
        </p>

        {/* Personal Information */}
        <div className="p-6 rounded-2xl border shadow bg-card mb-8">
          <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
          <form className="space-y-6">
            <div className="form-group">
              <label className="block mb-2 font-medium">Full Name:</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full p-2 rounded-lg border"
              />
            </div>
            <div className="form-group">
              <label className="block mb-2 font-medium">Email:</label>
              <input
                type="email"
                placeholder="john.doe@example.com"
                className="w-full p-2 rounded-lg border"
              />
            </div>
            <div className="form-group">
              <label className="block mb-2 font-medium">Role:</label>
              <select className="w-full p-2 rounded-lg border">
                <option>Student</option>
                <option>Educator</option>
                <option>Administrator</option>
              </select>
            </div>
            <Button type="submit" className="bg-[hsl(var(--primary))] text-white rounded-lg hover:opacity-90">
              Save Changes
            </Button>
          </form>
        </div>

        {/* Account Settings */}
        <div className="p-6 rounded-2xl border shadow bg-card">
          <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
          <form className="space-y-6">
            <div className="form-group">
              <label className="block mb-2 font-medium">Change Password:</label>
              <input
                type="password"
                placeholder="New password"
                className="w-full p-2 rounded-lg border"
              />
            </div>
            <div className="form-group">
              <label className="block mb-2 font-medium">Confirm Password:</label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full p-2 rounded-lg border"
              />
            </div>
            <Button type="submit" className="bg-[hsl(var(--primary))] text-white rounded-lg hover:opacity-90">
              Update Password
            </Button>
          </form>
        </div>
      </div>

      {/* Modals */}
      {isMounted && (
        <>
          <LoginModal
            isOpen={isLoginOpen}
            onClose={closeAllModals}
            openSignUp={openSignUp}
          />
          <SignUpModal
            isOpen={isSignUpOpen}
            onClose={closeAllModals}
            openLogin={openLogin}
          />
        </>
      )}
    </Layout>
  );
}