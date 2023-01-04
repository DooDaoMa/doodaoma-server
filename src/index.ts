import { createServer } from 'http'
import express, { json } from 'express'
import { Server } from 'socket.io'
import { authRouter } from './routes'
import { requireJWTAuth } from './config/jwt.config'
import { PORT } from './config/constant.config'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)
app.use(json())

// register router
app.use(authRouter)

app.get('/home', requireJWTAuth, (req, res) => {
  res.send('success')
})

app.get('/', (req, res) => {
  res.send('Express + TypeScript server')
})

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
