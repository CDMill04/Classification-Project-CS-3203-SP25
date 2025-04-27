'use client';

import { useEffect, useState } from "react";
import LoginModal from "@/app/components/modals/loginPage";
import SignUpModal from "@/app/components/modals/SignUpPage";
import { Button } from "@/app/components/ui/button";

export default function Dashboard() {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Functions to open/close modals
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

  if (!isMounted) return null; // This forces it to wait for the client

  return (
    <>
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <Button
          onClick={openLogin}
          className="bg-[hsl(var(--primary))] text-white hover:opacity-90 rounded-lg"
        >
          Log In
        </Button>
      </div>

      {/* Dashboard content */}
      <div className="p-6">
        <p>View your learning progress and upcoming assignments.</p>

        <div className="dashboard-grid mt-6">
          <div className="dashboard-card">
            <h3>Current Courses</h3>
            <ul>
              <li>Introduction to Computer Science</li>
              <li>Advanced Mathematics</li>
              <li>English Literature</li>
            </ul>
          </div>

          <div className="dashboard-card">
            <h3>Upcoming Assignments</h3>
            <ul>
              <li>CS101 Project - Due Apr 15</li>
              <li>Math Quiz - Due Apr 10</li>
              <li>Literature Essay - Due Apr 20</li>
            </ul>
          </div>

          <div className="dashboard-card">
            <h3>Recent Grades</h3>
            <ul>
              <li>CS101 Midterm - 92%</li>
              <li>Math Assignment - 88%</li>
              <li>Literature Discussion - 95%</li>
            </ul>
          </div>

          <div className="dashboard-card">
            <h3>Learning Progress</h3>
            <div className="progress-bar">
              <div className="progress" style={{ width: "75%" }}>
                75%
              </div>
            </div>
            <p>Overall completion rate for current semester</p>
          </div>
        </div>
      </div>

    {isMounted && (
      <>
      <LoginModal
        isOpen={isLoginOpen}
        onClose={closeAllModals}
        // ADD THIS: pass a prop to switch to Sign Up
        openSignUp={openSignUp}
      />
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={closeAllModals}
        openLogin={openLogin}
        />
      </>
    )}
  </>
  );
}
