import { createServer } from 'http'
import express, { json } from 'express'
import { Server } from 'socket.io'
import cors from 'cors'
import { authRouter } from './routes/authRoute'
import { devicesRouter } from './routes/devicesRoute'
import { requireJWTAuth } from './config/jwt.config'
import handler from './socket/handler'
import { PORT } from './config/constant.config'

const app = express()
const httpServer = createServer(app)

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    credentials: false,
  },
})
handler.registerSocketHandler(io)

app.use(cors())
app.use(json())

// register router
app.use(authRouter)
app.use(devicesRouter)

app.get('/home', requireJWTAuth, (req, res) => {
  res.json('success')
})

app.get('/', (req, res) => {
  res.json('Express + TypeScript server')
})
