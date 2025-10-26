import React, { useState, useEffect } from 'react'
import axios from 'axios'
import FileUploader from './components/FileUploader'
import FileList from './components/FileList'
import './styles/index.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://backend:5000'

const App = () => {
  const [files, setFiles] = useState([])

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`${API_URL}/files`)
      setFiles(res.data)
    } catch (err) {
      console.error('Failed to fetch files:', err)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const handleFileClick = (filename) => {
    window.open(`${API_URL}/files/${filename}`, '_blank')
  }

  return (
    <div className="container">
      <h1>📁 Local File Storage</h1>
      <FileUploader onUploadComplete={fetchFiles} />
      <FileList files={files} onFileClick={handleFileClick} />
    </div>
  )
}

export default App
