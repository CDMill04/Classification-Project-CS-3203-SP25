'use client';

import { useEffect, useState } from 'react';
import Layout from '@/app/components/Layout';
import useCurrentUser from '@/app/hooks/useCurrentUser';
import LoginModal from "@/app/components/modals/loginPage";
import SignUpModal from "@/app/components/modals/SignUpPage";
import { Button } from '@/app/components/ui/button';
import { fetchUserUploadsByEmail, generateFeedbackFromFilename } from './actions';
import { useSessionTimeout } from '../hooks/useSessionTimeout';

export default function ClassyPage() {
  useSessionTimeout();
  const { user, isMounted } = useCurrentUser();
  const [uploads, setUploads] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState(false);

  // Load user uploads
  useEffect(() => {
    async function loadUploads() {
      if (user?.email) {
        const results = await fetchUserUploadsByEmail(user.email);
        setUploads(results);
      }
    }
    loadUploads();
  }, [user]);

  const handleSubmit = async () => {
    if (!selectedFile || !user?.email) return;

    setFeedback('');
    setLoading(true);

    // Build final prompt with file content
    const result = await generateFeedbackFromFilename(user.email, selectedFile, customMessage);
    
    const finalFeedback = customMessage
      ? `Custom Instructions: ${customMessage}\n\nFeedback:\n${result}`
      : result;

    setFeedback(finalFeedback);
    setLoading(false);
  };

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

  if (!isMounted) return null;

  return (
    <Layout>
      <div className="flex flex-col min-h-screen relative">
        {/* Top Bar */}
        <div className="sticky top-0 z-20 flex justify-between items-center p-4 bg-background border-b">
          <h2 className="text-2xl font-bold">Classy AI</h2>
          {!user && (
          <Button
            onClick={openLogin}
            className="bg-[hsl(var(--primary))] text-white hover:opacity-90 rounded-lg"
          >
            Log In
          </Button>
          )}
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!user ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <img src="/broken_pencil.png" alt="Broken Pencil" className="w-64 h-64 mb-6 object-contain" />
              <p className="text-2xl font-semibold text-muted-foreground">
                Oops! You must be logged in to use Classy.
              </p>
            </div>
          ) : (
            <>
              {feedback && (
                <div className="p-4 bg-muted rounded-lg shadow text-muted-foreground whitespace-pre-wrap">
                  <h3 className="text-xl font-semibold mb-4">Classy's Feedback:</h3>
                  {feedback}
                </div>
              )}
            </>
          )}
        </div>

        {/* Sticky Input Section */}
        {user && (
          <div className="sticky bottom-0 bg-background p-4 border-t flex items-end justify-between">
            <div className="flex flex-col gap-4 w-full pr-8"> {/* padding-right for Classy */}
              <div>
                <label className="block mb-2 font-semibold">Select a file to review:</label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={selectedFile}
                  onChange={(e) => setSelectedFile(e.target.value)}
                >
                  <option value="">-- Choose a file --</option>
                  {uploads.map((file, i) => (
                    <option key={i} value={file.filename}>
                      {file.filename}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold">Enter custom instructions (optional):</label>
                <input
                  type="text"
                  placeholder="e.g., Focus on grammar issues"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <Button
                onClick={handleSubmit}
                className="bg-[hsl(var(--primary))] text-white hover:opacity-90 rounded-lg self-start"
                disabled={!selectedFile || loading}
              >
                {loading ? 'Thinking...' : 'Generate Feedback'}
              </Button>
            </div>

            {/* Classy icon inside the bar */}
            <img
              src="/ClassyLogo.png"
              alt="Classy Pencil"
              className="w-52 h-52 object-contain ml-4"
            />
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
