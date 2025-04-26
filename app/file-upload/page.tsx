"use client"

const USER_EMAIL = "userEmail@example.com"

import { useState, useEffect } from "react"
import { uploadToBlob, fetchUserUploads, updateUserUploads } from "./actions"

export default function FileUpload() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<
    { date: string; filename: string; semester: string; status: string }[]
  >([])
  const [semester, setSemester] = useState("")
  const [error, setError] = useState("")
  const [uploadSuccess, setUploadSuccess] = useState(false)

  // Fetch the user's uploads when the component mounts
  useEffect(() => {
    const fetchUploads = async () => {
      const uploads = await fetchUserUploads("USER_EMAIL") // Replace with actual user email
      setUploadedFiles(uploads)
    }

    fetchUploads()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
      setError("")
      setUploadSuccess(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (files.length === 0) {
      setError("Please select at least one file to upload")
      return
    }

    if (!semester) {
      setError("Please fill out semester")
      return
    }

    setUploading(true)
    setError("")
    setUploadSuccess(false)

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("semester", semester)

        const result = await uploadToBlob(formData)

        if (!result.success) {
          throw new Error(result.error || "Upload failed")
        }

        // Add the new file data to the user's JSON file
        const newUpload = {
          date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
          filename: file.name,
          semester,
          status: "Pending",
        }

        await updateUserUploads("USER_EMAIL", newUpload) // Replace with actual user email

        return newUpload
      })

      const results = await Promise.all(uploadPromises)

      // Update the table with the new uploads
      setUploadedFiles((prev) => [...results, ...prev])
      setFiles([])
      setUploadSuccess(true)
    } catch (err) {
      console.error("Upload error:", err)
      setError("An error occurred during upload: " + (err instanceof Error ? err.message : "Unknown error"))
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <h2>File Upload Center</h2>
      <p>Upload lesson plan files.</p>

      <div className="upload-section">
        <h3>Upload New File</h3>
        {error && <div className="error-message">{error}</div>}
        {uploadSuccess && <div className="success-message">Files uploaded successfully!</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Semester:</label>
            <select value={semester} onChange={(e) => setSemester(e.target.value)} required>
              <option value="">Select a semester</option>
              <option value="Spring">Spring</option>
              <option value="Fall">Fall</option>
            </select>
          </div>
          <div className="form-group">
            <label>Select File:</label>
            <input type="file" multiple onChange={handleFileChange} required />
            <p className="file-hint">Accepted formats: PDF, DOCX (Max size: 50MB)</p>
          </div>
          <button type="submit" disabled={uploading} className={uploading ? "uploading" : ""}>
            {uploading ? "Uploading..." : "Upload Files"}
          </button>
        </form>
      </div>

      <div className="upload-section">
        <h3>Recent Uploads</h3>
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
                <td>{file.filename}</td>
                <td>{file.semester}</td>
                <td>{file.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style jsx>{`
        .upload-section {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
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
        
        .status-graded {
          color: #3498db;
          font-weight: bold;
        }
        
        .action-link {
          color: #3498db;
          text-decoration: none;
          margin: 0 5px;
          cursor: pointer;
        }
        
        .action-link:hover {
          text-decoration: underline;
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
    </>
  )
}

