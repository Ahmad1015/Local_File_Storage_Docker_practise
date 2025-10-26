import React, { useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const FileUploader = ({ onUploadComplete }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleDrop = async (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    await uploadFiles(files)
  }

  const handleBrowse = async (e) => {
    const files = Array.from(e.target.files)
    await uploadFiles(files)
  }

  const uploadFiles = async (files) => {
    const formData = new FormData()
    files.forEach(file => formData.append('files', file))

    try {
      setUploading(true)
      await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      onUploadComplete()
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Upload failed. Check console for details.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div
      className={`uploader ${isDragging ? 'dragover' : ''}`}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <p>Drag and drop your files here</p>
      <p>or</p>
      <label>
        {uploading ? 'Uploading...' : 'Browse Files'}
        <input type="file" multiple onChange={handleBrowse} disabled={uploading} />
      </label>
    </div>
  )
}

export default FileUploader
