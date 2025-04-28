'use client';

import { useEffect, useState } from "react";
import LoginModal from "@/app/components/modals/loginPage";
import SignUpModal from "@/app/components/modals/SignUpPage";
import { Button } from "@/app/components/ui/button";
import Layout from "@/app/components/Layout";
import { useSessionTimeout } from "../hooks/useSessionTimeout";

export default function Dashboard() {
  useSessionTimeout();
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const success = localStorage.getItem('logoutSuccess');
    if (success) {
      setLogoutMessage(true);
      localStorage.removeItem('logoutSuccess'); // Clear flag immediately

      // Auto-hide the message after 3 seconds
      setTimeout(() => {
        setLogoutMessage(false);
      }, 3000);
    }
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

  if (!isMounted) return null; // Wait for client render

  return (
    <Layout>
      {/* Top Bar */}
      <div className="sticky top-0 z-20 flex justify-between items-center p-4 bg-background border-b">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <Button
          onClick={openLogin}
          className="bg-[hsl(var(--primary))] text-white hover:opacity-90 rounded-lg"
        >
          Log In
        </Button>
      </div>

      {/* Success Message */}
      {logoutMessage && (
        <div className="p-4 bg-green-100 text-green-800 text-center rounded-lg mt-6 mx-4">
          Logout successful!
        </div>
      )}

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 gap-6 mt-6">
        {/* Large Card: School Info */}
        <div className="p-6 rounded-2xl border shadow bg-card">
          <h3 className="text-2xl font-semibold mb-4">School Information</h3>
          <p className="text-muted-foreground mb-2">University of Oklahoma</p>
          <p className="text-muted-foreground mb-2">President: Joseph Harroz</p>
          <p className="text-muted-foreground">Number of Teachers: 4,000</p>

          {/* Divider Line */}
          <hr className="my-4 border-t-2 border-[hsl(var(--primary))] rounded-full" />

          {/* Progress Bar */}
          <h4 className="text-lg font-semibold mb-2">Semester Progress</h4>
          <div className="w-full bg-muted rounded-full h-4 mb-2">
            <div
              className="bg-[hsl(var(--primary))] h-4 rounded-full"
              style={{ width: "93.75%" }}
            ></div>
          </div>
          <p className="text-sm text-muted-foreground">
            93.75% through the current semester (Almost there!)
          </p>
        </div>

        {/* Two Smaller Cards in a Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Small Card 1: Profile Info */}
          <div className="p-6 rounded-2xl border shadow bg-card">
            <h3 className="text-xl font-semibold mb-4">Profile Info</h3>
            <p className="text-muted-foreground mb-2">Mansoor Abdulhaak</p>
            <p className="text-muted-foreground mb-2">Email: m.hak@ou.edu</p>
            <p className="text-muted-foreground">Role: Professor</p>
          </div>

          {/* Small Card 2: Recent Uploads */}
          <div className="p-6 rounded-2xl border shadow bg-card">
            <h3 className="text-xl font-semibold mb-4">Recent Uploads</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Ticket 5: Sprint 2 - Uploaded 2 weeks ago</li>
              <li>Ticket 4: System Architecture - Uploaded 3 weeks ago</li>
              <li>Security and Reliability - Uploaded 4 weeks ago</li>
              <li>User Stories - Uploaded 8 weeks ago</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Login and Sign Up Modals */}
      {isMounted && (
        <>
          <LoginModal
            isOpen={isLoginOpen}
            onClose={closeAllModals}
            openSignUp={openSignUp}
            onLoginSuccess={() => {
              closeAllModals();
              window.location.reload();
            }}
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
