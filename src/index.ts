import { createServer } from 'http'
import express, { json } from 'express'
import { Server } from 'ws'
import cors from 'cors'
import { authRouter } from './routes/authRoute'
import { accountRouter } from './routes/accountRoute'
import { devicesRouter } from './routes/devicesRoute'
import { requireJWTAuth } from './config/jwt.config'
import { PORT } from './config/constant.config'

const app = express()
const httpServer = createServer(app)
const wss = new Server({ server: httpServer })

app.use(json())
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://doodaoma-web.up.railway.app',
      'https://doodaoma-web-dev.up.railway.app',
    ],
    preflightContinue: true,
    credentials: true,
  }),
)

app.use(authRouter)
app.use('/api', accountRouter)
app.use('/api', devicesRouter)

app.get('/home', requireJWTAuth, (req, res) => {
  res.json('success')
})

app.get('/', (req, res) => {
  res.json('Express + TypeScript server')
})

wss.on('connection', (ws) => {
  ws.on('message', (message: string) => {
    console.log(`received ${message}`)
    ws.send(`Hello, you sent -> ${message}`)
  })
  console.log('Connected')
  ws.send('Hi from WebSocket server')
})

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
