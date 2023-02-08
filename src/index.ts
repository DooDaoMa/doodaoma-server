import { createServer } from 'http'
import express, { json } from 'express'
import { Server } from 'socket.io'
import cors from 'cors'
import { authRouter } from './routes/authRoute'
import { accountRouter } from './routes/account'
import { devicesRouter } from './routes/devicesRoute'
import { requireJWTAuth } from './config/jwt.config'
import handler from './socket/handler'
import { PORT } from './config/constant.config'
import { reservationRouter } from './routes/reservationRoute'
import { timeSlotRouter } from './routes/timeSlotRoute'

require('./services/createTimeSlot')

const app = express()
const httpServer = createServer(app)

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

const io = new Server(httpServer, {
  allowRequest: (req, callback) => {
    callback(null, true)
  },
})
handler.registerSocketHandler(io)

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
app.use('/api', timeSlotRouter)
app.use('/api', accountRouter)
app.use('/api', reservationRouter)
app.use(devicesRouter)

app.get('/home', requireJWTAuth, (req, res) => {
  res.json('success')
})

app.get('/', (req, res) => {
  res.json('Express + TypeScript server')
})
