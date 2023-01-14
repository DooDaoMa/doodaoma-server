import { createServer } from 'http'
import express, { json } from 'express'
import { Server } from 'socket.io'
import cors from 'cors'
import { authRouter } from './routes/authRoute'
import { accountRouter } from './routes/account'
import { requireJWTAuth } from './config/jwt.config'
import { PORT } from './config/constant.config'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)
app.use(json())
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://doodaoma-web.up.railway.app/'],
    preflightContinue: true,
    credentials: true,
  }),
)

// register router
app.use(authRouter)
app.use('/api/account', accountRouter)

app.get('/home', requireJWTAuth, (req, res) => {
  res.json('success')
})

app.get('/', (req, res) => {
  res.json('Express + TypeScript server')
})

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
