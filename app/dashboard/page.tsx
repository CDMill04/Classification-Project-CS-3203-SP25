'use client';

import { useEffect, useState } from "react";
import LoginModal from "@/app/components/modals/loginPage";
import SignUpModal from "@/app/components/modals/SignUpPage";
import { Button } from "@/app/components/ui/button";
import Layout from "@/app/components/Layout";
import { useSessionTimeout } from "../hooks/useSessionTimeout";
import useCurrentUser from "@/app/hooks/useCurrentUser";
import { fetchUserByEmail, fetchUserUploadsByEmail } from "./actions";


import { OriginGuard } from "@/app/OriginGuard";
export default function DashboardPage() {
  return (
    <>
      <OriginGuard               /* ← the referrer check */
        allowList={[
          "https://lms.example.edu",
          "http://localhost:3000",
        ]}
      />

      <Dashboard />             {/* ← your real UI */}
    </>
  );
}

export function Dashboard() {
  useSessionTimeout();

  const { user, isMounted } = useCurrentUser();
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [userInfo, setUserInfo] = useState<any>(null);
  const [userUploads, setUserUploads] = useState<any[]>([]);

  useEffect(() => {
    const success = localStorage.getItem('logoutSuccess');
    if (success) {
      setLogoutMessage(true);
      localStorage.removeItem('logoutSuccess');
  
      setTimeout(() => {
        setLogoutMessage(false);
      }, 3000);
    }
  }, []);  

  // Set today's date
  useEffect(() => {
    if (!isMounted) return;

    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    setCurrentDate(today.toLocaleDateString(undefined, options));
  }, [isMounted]);

  // Fetch user info if logged in
  useEffect(() => {
    async function loadUserInfoAndUploads() {
      if (user?.email) {
        const loadedUser = await fetchUserByEmail(user.email);
        setUserInfo(loadedUser);
  
        const loadedUploads = await fetchUserUploadsByEmail(user.email);
        setUserUploads(loadedUploads);
      }
    }
  
    loadUserInfoAndUploads();
  }, [user]);

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
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
        </div>
        {!user && (
        <Button
          onClick={openLogin}
          className="bg-[hsl(var(--primary))] text-white hover:opacity-90 rounded-lg"
        >
          Log In
        </Button>
        )}
      </div>

      {/* Success Message */}
      {logoutMessage && (
        <div className="p-4 bg-green-100 text-green-800 text-center rounded-lg mt-6 mx-4">
          Logout successful!
        </div>
      )}

      {/* Main Dashboard Content */}
      <div className="p-6 mt-6">
        {!user ? (
          <div className="flex flex-1 flex-col items-center justify-start text-center px-8 pt-16 h-[calc(100vh-64px)]">
          <img 
            src="/broken_pencil.png" 
            alt="Broken Pencil" 
            className="w-64 h-64 mb-6 object-contain" 
          />
          <p className="text-2xl font-semibold text-muted-foreground">
            Oops! You must be logged in to view the Dashboard.
          </p>
        </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {/* Semester Progress (TOP) */}
            <div className="p-6 rounded-2xl border shadow bg-card">
              <h4 className="text-lg font-semibold mb-4">Semester Progress</h4>
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

            {/* Profile Info (now first) */}
            <div className="p-6 rounded-2xl border shadow bg-card">
              <h3 className="text-xl font-semibold mb-4">Profile Info</h3>
              {userInfo ? (
                <>
                  <p className="text-muted-foreground mb-2">{userInfo.name}</p>
                  <p className="text-muted-foreground mb-2">Email: {userInfo.email}</p>
                  <p className="text-muted-foreground">Role: {userInfo.role || "Unknown"}</p>
                </>
              ) : (
                <p className="text-muted-foreground">Loading user info...</p>
              )}
            </div>

            {/* Recent Uploads (now below Profile Info) */}
            <div className="p-6 rounded-2xl border shadow bg-card">
              <h3 className="text-xl font-semibold mb-4">Recent Uploads</h3>
              {userUploads.length === 0 ? (
                <p className="text-muted-foreground">No uploads found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-muted-foreground">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">File</th>
                        <th className="px-4 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userUploads.map((upload, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-2">{upload.date}</td>
                          <td className="px-4 py-2">
                            <a href={upload.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              {upload.filename}
                            </a>
                          </td>
                          <td className="px-4 py-2">{upload.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Login and Sign Up Modals */}
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
    </Layout>
  );
}
