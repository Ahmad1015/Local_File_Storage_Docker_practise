import React from 'react'

const FileList = ({ files, onFileClick, backendAvailable }) => {
  if (!backendAvailable) {
    return <p style={{ color: 'red' }}>Backend is unavailable. File list cannot be loaded.</p>;
  }

  if (files.length === 0)
    return <p>No files uploaded yet.</p>

  return (
    <div className="file-list">
      <h2>Uploaded Files</h2>
      <ul>
        {files.map((file, index) => (
          <li key={index} onClick={() => onFileClick(file.filename)}>
            {file.filename}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FileList
