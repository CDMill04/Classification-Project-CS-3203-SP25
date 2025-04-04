"use client"

import type React from "react"

import { useState } from "react"
import { uploadToBlob } from "./actions"

export default function FileUpload() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<
    { name: string; url: string; course: string; assignment: string }[]
  >([])
  const [course, setCourse] = useState("")
  const [assignment, setAssignment] = useState("")
  const [fileType, setFileType] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [uploadSuccess, setUploadSuccess] = useState(false)

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

    if (!course || !assignment || !fileType) {
      setError("Please fill out all required fields")
      return
    }

    setUploading(true)
    setError("")
    setUploadSuccess(false)

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("course", course)
        formData.append("assignment", assignment)
        formData.append("fileType", fileType)
        formData.append("description", description)

        const result = await uploadToBlob(formData)

        if (!result.success) {
          throw new Error(result.error || "Upload failed")
        }

        return {
          name: file.name,
          url: result.url,
          course,
          assignment,
        }
      })

      const results = await Promise.all(uploadPromises)

      setUploadedFiles((prev) => [...results, ...prev])
      setFiles([])
      setUploadSuccess(true)

      // Keep the form values for convenience if uploading multiple batches
      // setCourse('')
      // setAssignment('')
      // setFileType('')
      // setDescription('')
    } catch (err) {
      console.error("Upload error:", err)
      setError("An error occurred during upload: " + (err instanceof Error ? err.message : "Unknown error"))
    } finally {
      setUploading(false)
    }
  }

  // Generate current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const now = new Date()
    return now.toISOString().split("T")[0]
  }

  return (
    <>
      <h2>File Upload Center</h2>
      <p>Upload assignments, projects, and other documents to your courses.</p>

      <div className="upload-section">
        <h3>Upload New File</h3>
        {error && <div className="error-message">{error}</div>}
        {uploadSuccess && <div className="success-message">Files uploaded successfully!</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Course:</label>
            <select value={course} onChange={(e) => setCourse(e.target.value)} required>
              <option value="">Select a course</option>
              <option value="Introduction to Computer Science">Introduction to Computer Science</option>
              <option value="Advanced Mathematics">Advanced Mathematics</option>
              <option value="English Literature">English Literature</option>
            </select>
          </div>
          <div className="form-group">
            <label>Assignment:</label>
            <select value={assignment} onChange={(e) => setAssignment(e.target.value)} required>
              <option value="">Select an assignment</option>
              <option value="Homework #3">Homework #3</option>
              <option value="Term Paper">Term Paper</option>
              <option value="Final Project">Final Project</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>File Type:</label>
            <select value={fileType} onChange={(e) => setFileType(e.target.value)} required>
              <option value="">Select file type</option>
              <option value="Assignment Submission">Assignment Submission</option>
              <option value="Project Documentation">Project Documentation</option>
              <option value="Supplementary Material">Supplementary Material</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Select File:</label>
            <input type="file" multiple onChange={handleFileChange} required />
            <p className="file-hint">Accepted formats: PDF, DOCX, PPTX, ZIP (Max size: 50MB)</p>
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              rows={3}
              placeholder="Brief description of the uploaded file(s)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
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
              <th>Course</th>
              <th>Assignment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {uploadedFiles.map((file, index) => (
              <tr key={index}>
                <td>{getCurrentDate()}</td>
                <td>{file.name}</td>
                <td>{file.course}</td>
                <td>{file.assignment}</td>
                <td>
                  <span className="status-pending">Pending Review</span>
                </td>
                <td>
                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="action-link">
                    View
                  </a>{" "}
                  |
                  <a href="#" className="action-link">
                    Replace
                  </a>{" "}
                  |
                  <a href="#" className="action-link">
                    Delete
                  </a>
                </td>
              </tr>
            ))}
            {uploadedFiles.length === 0 && (
              <>
                <tr>
                  <td>Apr 2, 2025</td>
                  <td>final-project.pdf</td>
                  <td>Computer Science</td>
                  <td>Final Project</td>
                  <td>
                    <span className="status-pending">Pending Review</span>
                  </td>
                  <td>
                    <a href="#" className="action-link">
                      View
                    </a>{" "}
                    |
                    <a href="#" className="action-link">
                      Replace
                    </a>{" "}
                    |
                    <a href="#" className="action-link">
                      Delete
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Mar 28, 2025</td>
                  <td>math-homework3.docx</td>
                  <td>Advanced Mathematics</td>
                  <td>Homework #3</td>
                  <td>
                    <span className="status-approved">Approved</span>
                  </td>
                  <td>
                    <a href="#" className="action-link">
                      View
                    </a>{" "}
                    |
                    <a href="#" className="action-link">
                      Replace
                    </a>{" "}
                    |
                    <a href="#" className="action-link">
                      Delete
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Mar 15, 2025</td>
                  <td>literature-essay.docx</td>
                  <td>English Literature</td>
                  <td>Term Paper</td>
                  <td>
                    <span className="status-graded">Graded: A-</span>
                  </td>
                  <td>
                    <a href="#" className="action-link">
                      View
                    </a>{" "}
                    |
                    <a href="#" className="action-link">
                      Download
                    </a>
                  </td>
                </tr>
              </>
            )}
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

