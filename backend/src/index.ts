// backend/src/index.ts
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import setupRoutes from './routes'
import path from 'path'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/userImages', express.static(path.join(__dirname, 'userImages')))
setupRoutes(app)

app.listen(3001, () => {
  console.log(`Server is running on port 3001`)
})
