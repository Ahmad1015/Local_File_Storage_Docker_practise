import express from 'express'
import multer from 'multer'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import pkg from 'pg'
import { fileURLToPath } from 'url'

const { Pool } = pkg
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

// PostgreSQL setup
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'db',
  database: process.env.POSTGRES_DB || 'filesdb',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  port: 5432,
})

// Ensure table exists
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS files (
      id SERIAL PRIMARY KEY,
      filename TEXT,
      mimetype TEXT,
      size INTEGER,
      uploaded_at TIMESTAMP DEFAULT NOW()
    )
  `)
  console.log("✅ Database initialized")
}
initDB().catch(console.error)

// File upload setup
const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, file.originalname)
})
const upload = multer({ storage })

// Routes
app.post('/upload', upload.array('files'), async (req, res) => {
  try {
    for (const file of req.files) {
      await pool.query(
        'INSERT INTO files (filename, mimetype, size) VALUES ($1, $2, $3)',
        [file.originalname, file.mimetype, file.size]
      )
    }
    res.json({ message: 'Files uploaded successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Upload failed' })
  }
})

app.get('/files', async (_, res) => {
  try {
    const result = await pool.query('SELECT * FROM files ORDER BY uploaded_at DESC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch files' })
  }
})

app.get('/files/:filename', (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename)
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' })
  res.sendFile(filePath)
})

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
})
