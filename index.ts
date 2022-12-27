import express, { Express, Request, Response, NextFunction } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import { authRouter } from './src/routes';
import { requireJWTAuth } from './src/config/jwt.config';

dotenv.config()

const app: Express = express()
const httpServer = createServer(app)
const io = new Server(httpServer)
const port = process.env.PORT || 8000
app.use(bodyParser.json());

// register router
app.use(authRouter);

app.get('/home', requireJWTAuth, (req, res) => {
  res.send("success");
});

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript server')
})

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
