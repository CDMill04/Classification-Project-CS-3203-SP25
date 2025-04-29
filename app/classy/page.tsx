'use client';

import { useEffect, useState } from 'react';
import Layout from '@/app/components/Layout';
import useCurrentUser from '@/app/hooks/useCurrentUser';
import LoginModal from "@/app/components/modals/loginPage";
import SignUpModal from "@/app/components/modals/SignUpPage";
import { Button } from '@/app/components/ui/button';
import { fetchUserUploadsByEmail, generateFeedbackFromFilename } from './actions';

export default function ClassyPage() {
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
      <div className="sticky top-0 z-20 flex justify-between items-center p-4 bg-background border-b">
        <div>
          <h2 className="text-2xl font-bold">Classy AI</h2>
        </div>
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

      {/* Main Page Content */}
      <div className="p-6 mt-6 space-y-6">
        {!user ? (
          <div className="flex flex-1 flex-col items-center justify-start text-center px-8 pt-16 h-[calc(100vh-64px)]">
          <img 
            src="/broken_pencil.png" 
            alt="Broken Pencil" 
            className="w-64 h-64 mb-6 object-contain" 
          />
          <p className="text-2xl font-semibold text-muted-foreground">
            Oops! You must be logged in to use Classy.
          </p>
        </div>
        ) : (
          <>
            {/* File Selector */}
            <div>
              <label className="block mb-2 font-semibold">Select a file to review:</label>
              <select
                className="w-full p-2 border rounded-lg mb-4"
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

            {/* Text Input */}
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

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              className="mt-4 bg-[hsl(var(--primary))] text-white hover:opacity-90 rounded-lg"
              disabled={!selectedFile || loading}
            >
              {loading ? 'Thinking...' : 'Generate Feedback'}
            </Button>

            {/* Feedback Output */}
            {feedback && (
              <div className="mt-6 p-4 bg-muted rounded-lg shadow text-muted-foreground whitespace-pre-wrap">
                <h3 className="text-xl font-semibold mb-4">Classy's Feedback:</h3>
                {feedback}
              </div>
            )}
          </>
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
