"use client";

import { useState, useEffect } from "react";
import { uploadToBlob, fetchUserUploads, updateUserUploads, updateFileStatus } from "./actions";

import Layout from "@/app/components/Layout";
import { Button } from "@/app/components/ui/button";
import LoginModal from "@/app/components/modals/loginPage";
import SignUpModal from "@/app/components/modals/SignUpPage";

import useCurrentUser from "@/app/hooks/useCurrentUser";
import users from "@/app/data/users.json"; // Assuming you have a JSON file with user data

// File sanitization function for CWE-79: Improper Neutralization of Input During Web Page Generation ('Cross-site Scripting')
// This function replaces unsafe characters in filenames with underscores and limits the length to 100 characters.
const sanitizeFilename = (name: string) => {
  const safeName = name
    .replace(/[^a-zA-Z0-9.\-_]/g, '_')    // Allow only safe characters
    .replace(/\.+/g, '.')                 // Replace multiple dots with one dot
    .replace(/^\.*/, '')                  // Remove leading dots
    .replace(/_*$/, '');                  // Remove trailing underscores
  return safeName.length > 100 ? safeName.slice(0, 100) : safeName; // Limit filename length
};

import { OriginGuard } from "@/app/OriginGuard";
export default function FileUploadPage() {
  return (
    <>
      <OriginGuard               /* ← the referrer check */
        allowList={[
          "https://lms.example.edu",
          "http://localhost:3000",
        ]}
      />

      <FileUpload />             {/* ← your real UI */}
    </>
  );
}

export function FileUpload() {
  const { user, setUser, isMounted } = useCurrentUser();  // <-- NEW HOOK

  // const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    { date: string; filename: string; semester: string; status: string; url: string }[]
  >([]);
  const [semester, setSemester] = useState("");
  const [error, setError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  // const [isMounted, setIsMounted] = useState(false);

  const USER_EMAIL = user?.email || ""; // <-- CORRECT: outside, dynamically using user
  function getRoleByEmail(USER_EMAIL: string) {
    const user = users.find(u => u.email === USER_EMAIL);
    return user ? user.role : null;
  }

  /*
  useEffect(() => {
    setIsMounted(true);

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);
  */

  // Fetch uploads when user is ready
  useEffect(() => {
    if (USER_EMAIL) {
      const role = getRoleByEmail(USER_EMAIL)?.toLowerCase();
      if (role === "teacher") {
        setIsTeacher(true);
        setIsAdmin(false);
      } else if (role === "admin"){
        setIsTeacher(false);
        setIsAdmin(true);
      } else {
        setIsTeacher(false);
        setIsTeacher(false);
      } 
      console.log("Fetching uploads...");
      fetchUploads();
    }
  }, [USER_EMAIL]); // depend on USER_EMAIL

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

  const fetchUploads = async () => {
    try {
      setLoading(true);
      const uploads = await fetchUserUploads(USER_EMAIL);
      console.log("Fetched uploads:", uploads);
      setUploadedFiles(uploads);
    } catch (error) {
      console.error("Error in fetchUploads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (index: number, newStatus: string) => {
    try {
      const updatedFiles = [...uploadedFiles];
      const fileToUpdate = updatedFiles[index];
  
      fileToUpdate.status = newStatus;
  
      // Assuming `user.email` holds the email of the user who uploaded the file
      const fileWithUser = { 
        ...fileToUpdate, 
        uploadedBy: user?.email || ""  // Add the `uploadedBy` field here
      };
  
      await updateFileStatus(USER_EMAIL, fileToUpdate.filename, newStatus);
  
      if (newStatus === "Approved") {
        await sendApprovalEmail();
      } else if (newStatus === "Disapproved") {
        await sendDisapprovalEmail();
      }

      setUploadedFiles(updatedFiles);
      console.log("Status updated successfully:", fileToUpdate);
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update status. Please try again.");
    }
  };
  

  const sendApprovalEmail = async () => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: USER_EMAIL,  // Using USER_EMAIL here
          subject: 'Your Curriculum Has Been Approved!',
          text: `Hello, your curriculum Has Been Approved by the Admin. You can now view it in the File Upload Center.`,
        }),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Approval email sent successfully:', result.message);
      } else {
        const errorText = await response.text();
        console.error('Error sending approval email:', errorText);
      }
    } catch (error: any) {
      console.error('Error sending approval email:', error);
    }
  };

  const sendDisapprovalEmail = async () => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: USER_EMAIL,  // Still using USER_EMAIL
          subject: 'Your Curriculum Has Been Disapproved',
          text: `Hello, your curriculum has been disapproved by the Admin. You may review it and re-upload if necessary.`,
        }),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Disapproval email sent successfully:', result.message);
      } else {
        const errorText = await response.text();
        console.error('Error sending disapproval email:', errorText);
      }
    } catch (error: any) {
      console.error('Error sending disapproval email:', error);
    }
  };
  
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setError("");
      setUploadSuccess(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (files.length === 0) {
      setError("Please select at least one file to upload");
      return;
    }

    if (!semester) {
      setError("Please fill out semester");
      return;
    }

    setUploading(true);
    setError("");
    setUploadSuccess(false);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("semester", semester);

        const result = await uploadToBlob(formData, USER_EMAIL);

        if (!result.success) {
          throw new Error(result.error || "Upload failed");
        }

        const newUpload = {
          date: new Date().toISOString().split("T")[0],
          filename: sanitizeFilename(file.name),
          semester,
          status: "Pending",
          url: result.url || "",
        };

        setUploadedFiles((prev) => [newUpload, ...prev]);
        await updateUserUploads(USER_EMAIL, newUpload);

        return newUpload;
      });

      await Promise.all(uploadPromises);

      setFiles([]);
      setUploadSuccess(true);
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        "An error occurred during upload: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      <div className="sticky top-0 z-20 flex justify-between items-center p-4 bg-background border-b">
        <h2 className="text-2xl font-bold">File Upload Center</h2>
        {!user && (
        <Button
          onClick={openLogin}
          className="bg-[hsl(var(--primary))] text-white hover:opacity-90 rounded-lg"
        >
          Log In
        </Button>
        )}
  </div>
      <div className="p-6 mt-6">
        {loading ? (
          <div className="flex flex-1 flex-col items-center justify-start text-center px-8 pt-16 h-[calc(100vh-64px)]">
          <img 
            src="/broken_pencil.png" 
            alt="Broken Pencil" 
            className="w-64 h-64 mb-6 object-contain" 
          />
          <p className="text-2xl font-semibold text-muted-foreground">
            Oops! You must be logged in to view your uploads.
          </p>
        </div>
        ) : !isTeacher && isAdmin ? (
          //ADMIN VIEW
          <div className="upload-section">
          <h3>Recent Uploads - Can take up to a minute to show changes</h3>
          <table className="uploads-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Filename</th>
                <th>Semester</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {uploadedFiles.map((file, index) => (
                <tr key={index}>
                  <td>{file.date}</td>
                  <td>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {file.filename}
                    </a>
                  </td>
                  <td>{file.semester}</td>
                  <td className={`status-${file.status.toLowerCase()}`}>
                    {file.status}
                  </td>
                  <td>
                    <button
                      className="action-link approve"
                      onClick={() => handleStatusChange(index, "Approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="action-link disapprove"
                      onClick={() => handleStatusChange(index, "Disapproved")}
                    >
                      Disapprove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        ) : isTeacher && !isAdmin ? (
          //TEACHER VIEW
          <>
            <div className="upload-section">
              <h3>Upload New File</h3>
              {error && <div className="error-message">{error}</div>}
              {uploadSuccess && (
                <div className="success-message">Files uploaded successfully!</div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Semester:</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    required
                  >
                    <option value="">Select a semester</option>
                    <option value="Spring">Spring</option>
                    <option value="Fall">Fall</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Select File:</label>
                  <input 
                    type="file" 
                    accept="application/pdf"
                    multiple 
                    onChange={handleFileChange} 
                    required />
                  <p className="file-hint">
                    Accepted formats: PDF (Max size: 50MB)
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={uploading}
                  className={uploading ? "uploading" : ""}
                >
                  {uploading ? "Uploading..." : "Upload Files"}
                </button>
              </form>
            </div>

            <div className="upload-section">
              <h3>Recent Uploads - Can take up to a minute to show changes</h3>
              <table className="uploads-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Filename</th>
                    <th>Semester</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadedFiles.map((file, index) => (
                    <tr key={index}>
                      <td>{file.date}</td>
                      <td>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {file.filename}
                        </a>
                      </td>
                      <td>{file.semester}</td>
                      <td className={`status-${file.status.toLowerCase()}`}>
                        {file.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
      ) : (
        //UNKNOWN VIEW
        <div className="flex flex-col items-center justify-center text-center px-9 pt-16 h-[calc(100vh-64px)]">
        <img 
          src="/broken_pencil.png"
          alt="Unknown Role"
          className="w-64 h-64 mb-6 object-contain"
        />
        <p className="text-2xl font-semibold text-muted-foreground">
          You are logged in with an unrecognized role. Please contact your administrator.
        </p>
      </div>
      )}
      <style jsx>{`
        .upload-section {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }
        
        .uploads-table a {
          color: #007bff; /* Blue color for the link */
          text-decoration: none; /* Remove underline */
        }

        .uploads-table a:hover {
          text-decoration: underline; /* Add underline on hover */
        }
        
        .file-hint {
          font-size: 0.8rem;
          color: #6c757d;
          margin-top: 0.25rem;
        }
        
        textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          font-family: inherit;
        }
        
        .uploads-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }
        
        .uploads-table th, .uploads-table td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        
        .uploads-table th {
          background-color: #f1f1f1;
          font-weight: bold;
        }
        
        .uploads-table tr:hover {
          background-color: #f5f5f5;
        }
        
        .status-pending {
          color: #f39c12;
          font-weight: bold;
        }
        
        .status-approved {
          color: #27ae60;
          font-weight: bold;
        }

        .status-disapproved {
          color: #e74c3c;
          font-weight: bold;
        }
        
        .action-link {
          display: inline-block;
          padding: 0.25rem 0.5rem; /* Adjust padding for smaller buttons */
          font-size: 0.9rem; /* Reduce font size */
          border: 1px solid transparent; /* Add a border for better visibility */
          border-radius: 4px; /* Rounded corners */
          cursor: pointer;
          margin: 0 5px; /* Add spacing between buttons */
          text-align: center;
          text-decoration: none;
          transition: background-color 0.3s, color 0.3s;
        }

        .action-link.approve {
          background-color: #28a745; /* Green background */
          color: white; /* White text */
          border-color: #28a745; /* Green border */
        }

        .action-link.approve:hover {
          background-color: #218838; /* Darker green on hover */
          border-color: #1e7e34;
        }

        .action-link.disapprove {
          background-color: #dc3545; /* Red background */
          color: white; /* White text */
          border-color: #dc3545; /* Red border */
        }

        .action-link.disapprove:hover {
          background-color: #c82333; /* Darker red on hover */
          border-color: #bd2130;
        }

        .action-link:focus {
          outline: none; /* Remove default focus outline */
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25); /* Add custom focus outline */
        }

        .error-message {
          background-color: #f8d7da;
          color: #721c24;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        
        .success-message {
          background-color: #d4edda;
          color: #155724;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
        }

        button.uploading {
          background-color: #6c757d;
          cursor: not-allowed;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }

        input, select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        button {
          background-color: #3498db;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s;
        }

        button:hover:not(:disabled) {
          background-color: #2980b9;
        }
      `}</style>
      </div>
      {/* Modals */}
      {isMounted && (
        <>
          <LoginModal
            isOpen={isLoginOpen}
            onClose={closeAllModals}
            openSignUp={openSignUp}
            onLoginSuccess={() => {
              closeAllModals();
              window.location.reload(); // Reload to fetch uploads
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
  )
}