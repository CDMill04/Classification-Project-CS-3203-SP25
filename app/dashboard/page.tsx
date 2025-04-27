'use client';

import { useEffect, useState } from "react";
import LoginModal from "@/app/components/modals/loginPage";
import SignUpModal from "@/app/components/modals/SignUpPage";
import { Button } from "@/app/components/ui/button";
import Layout from "@/app/components/Layout";

export default function Dashboard() {
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

      {/* Main Dashboard Content */}
      <div className="p-6">
        <p className="text-lg mb-6">
          View your learning progress and upcoming assignments.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Current Courses */}
          <div className="p-6 rounded-2xl border shadow bg-card">
            <h3 className="text-xl font-semibold mb-2">Current Courses</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Introduction to Computer Science</li>
              <li>Advanced Mathematics</li>
              <li>English Literature</li>
            </ul>
          </div>

          {/* Card 2: Upcoming Assignments */}
          <div className="p-6 rounded-2xl border shadow bg-card">
            <h3 className="text-xl font-semibold mb-2">Upcoming Assignments</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>CS101 Project - Due Apr 15</li>
              <li>Math Quiz - Due Apr 10</li>
              <li>Literature Essay - Due Apr 20</li>
            </ul>
          </div>

          {/* Card 3: Recent Grades */}
          <div className="p-6 rounded-2xl border shadow bg-card">
            <h3 className="text-xl font-semibold mb-2">Recent Grades</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>CS101 Midterm - 92%</li>
              <li>Math Assignment - 88%</li>
              <li>Literature Discussion - 95%</li>
            </ul>
          </div>

          {/* Card 4: Learning Progress */}
          <div className="p-6 rounded-2xl border shadow bg-card">
            <h3 className="text-xl font-semibold mb-2">Learning Progress</h3>
            <div className="w-full bg-muted rounded-full h-4 mb-2">
              <div
                className="bg-[hsl(var(--primary))] h-4 rounded-full"
                style={{ width: "75%" }}
              ></div>
            </div>
            <p className="text-sm text-muted-foreground">
              Overall completion rate for current semester
            </p>
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