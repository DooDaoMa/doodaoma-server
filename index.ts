import express, { Express, Request, Response } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'

dotenv.config()

const app: Express = express()
const httpServer = createServer(app)
const io = new Server(httpServer)
const port = process.env.PORT || 8000

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript server')
})

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
