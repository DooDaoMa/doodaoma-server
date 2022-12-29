import express, { Request, Response } from 'express'
import { loginMiddleware } from '../middlewares'
import jwt from 'jwt-simple'
import { User } from '../models'

export const authRouter = express.Router()

authRouter.post('/login', loginMiddleware, async (req, res) => {
  try {
    const payload = {
      sub: req.body.username,
      iat: new Date().getTime(), //มาจากคำว่า issued at time (สร้างเมื่อ)
    }
    const SECRET = 'MY_SECRET_KEY' //ในการใช้งานจริง คีย์นี้ให้เก็บเป็นความลับ
    res.status(201).send(jwt.encode(payload, SECRET))
  } catch {
    res.status(500)
  }
})

authRouter.post('/signup', async (req: Request, res: Response) => {
  const payload = req.body
  try {
    const newUser = new User({
      username: payload.username,
      password: payload.password,
      email: payload.email,
    })
    await newUser.save()
    res.status(201).end()
  } catch (error) {
    res.status(400).json(error)
  }
})
