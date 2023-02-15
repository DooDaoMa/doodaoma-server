import { createServer } from 'http'
import { parse } from 'url'
import express, { json } from 'express'
import { Server } from 'ws'
import cors from 'cors'
import { authRouter } from './routes/authRoute'
import { accountRouter } from './routes/accountRoute'
import { devicesRouter } from './routes/devicesRoute'
import { requireJWTAuth } from './config/jwt.config'
import { PORT } from './config/constant.config'
import { imagesRoute } from './routes/imagesRoute'

const app = express()

const httpServer = createServer(app)
const webWs = new Server({ noServer: true })
const ninaWs = new Server({ noServer: true })

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
app.use('/api', imagesRoute)

app.get('/home', requireJWTAuth, (req, res) => {
  res.json('success')
})

app.get('/', (req, res) => {
  res.json('Express + TypeScript server')
})

webWs.on('connection', (ws) => {
  ws.on('message', (message: string) => {
    console.log(`received ${message} in web`)
    ws.send(`Hello, you sent -> ${message}`)
  })
  console.log('Connected from web')
  ws.send(JSON.stringify({ message: 'Hello from server to web' }))
})

ninaWs.on('connection', (ws) => {
  ws.on('message', (message: string) => {
    const parsedMessage = JSON.parse(message) as IMessage
    console.log(`received ${message} in nina`)
    ws.send(`Hello, you sent -> ${message}`)

    if (parsedMessage.type === 'uploadImage') {
      const fileBody = parsedMessage.payload.body
      console.log(`File body: ${fileBody}`)
    }
  })
  console.log('Connected from nina')
  ws.send(JSON.stringify({ message: 'Hello from server to nina' }))
})

httpServer.on('upgrade', (req, socket, head) => {
  const { pathname } = parse(req.url || '/')
  if (pathname === '/web') {
    webWs.handleUpgrade(req, socket, head, (ws) => {
      webWs.emit('connection', ws, req)
    })
  } else if (pathname === '/nina') {
    ninaWs.handleUpgrade(req, socket, head, (ws) => {
      ninaWs.emit('connection', ws, req)
    })
  } else {
    socket.destroy()
  }
})

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
