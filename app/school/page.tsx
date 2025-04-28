'use client';

import { useState, useEffect } from "react";
import Layout from "@/app/components/Layout";
import { Button } from "@/app/components/ui/button";
import LoginModal from "@/app/components/modals/loginPage";
import SignUpModal from "@/app/components/modals/SignUpPage";

export default function SchoolPage() {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

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
        <h2 className="text-2xl font-bold">School</h2>
        <Button
          onClick={openLogin}
          className="bg-[hsl(var(--primary))] text-white hover:opacity-90 rounded-lg"
        >
          Log In
        </Button>
      </div>

      {/* Page Content */}
      <div className="p-6 mt-6">
        <h2 className="text-2xl font-bold mb-6">Manage School</h2>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Join a School */}
          <div className="p-6 rounded-2xl border shadow bg-card">
            <h3 className="text-xl font-semibold mb-4">Join a School</h3>
            <form className="space-y-6">
              <div className="form-group">
                <label className="block mb-2 font-medium">School Code:</label>
                <input
                  type="text"
                  placeholder="Enter school code"
                  className="w-full p-2 rounded-lg border"
                />
              </div>
              <Button type="submit" className="w-full bg-[hsl(var(--primary))] text-white rounded-lg hover:opacity-90">
                Join School
              </Button>
            </form>
          </div>

          {/* Create a School */}
          <div className="p-6 rounded-2xl border shadow bg-card">
            <h3 className="text-xl font-semibold mb-4">Create a School</h3>
            {!showCreateForm ? (
              <Button
                onClick={() => setShowCreateForm(true)}
                className="w-full bg-[hsl(var(--primary))] text-white rounded-lg hover:opacity-90"
              >
                Create New School
              </Button>
            ) : (
              <form className="space-y-6 mt-4">
                <div className="form-group">
                  <label className="block mb-2 font-medium">School Name:</label>
                  <input
                    type="text"
                    placeholder="Enter school name"
                    className="w-full p-2 rounded-lg border"
                  />
                </div>
                <div className="form-group">
                  <label className="block mb-2 font-medium">School Address:</label>
                  <input
                    type="text"
                    placeholder="Enter address"
                    className="w-full p-2 rounded-lg border"
                  />
                </div>
                <div className="form-group">
                  <label className="block mb-2 font-medium">School Description:</label>
                  <textarea
                    placeholder="Optional: brief description"
                    className="w-full p-2 rounded-lg border"
                  ></textarea>
                </div>
                <Button type="submit" className="w-full bg-[hsl(var(--primary))] text-white rounded-lg hover:opacity-90">
                  Submit School
                </Button>
              </form>
            )}
          </div>
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
