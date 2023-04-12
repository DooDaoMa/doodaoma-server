import { createServer } from 'http'
import express, { json } from 'express'
import cors from 'cors'
import { authRouter } from './routes/authRoute'
import { accountRouter } from './routes/accountRoute'
import { devicesRouter } from './routes/devicesRoute'
import { requireJWTAuth } from './config/jwt.config'
import { PORT } from './config/constant.config'
import { imagesRoute } from './routes/imagesRoute'
import { reservationRouter } from './routes/reservationRoute'
import { timeSlotRouter } from './routes/timeSlotRoute'
import initSocket from './socket/initSocket'

require('./services/manageTimeSlot')

process.env.TZ = 'Asia/Bangkok'

const app = express()

const httpServer = createServer(app)
initSocket(httpServer)

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
app.use('/api', timeSlotRouter)
app.use('/api', accountRouter)
app.use('/api', devicesRouter)
app.use('/api', imagesRoute)
app.use('/api', reservationRouter)

app.get('/home', requireJWTAuth, (req, res) => {
  res.json('success')
})

app.get('/', (req, res) => {
  res.json('Express + TypeScript server')
})

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
