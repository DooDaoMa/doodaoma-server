import { Request, Response, Router } from 'express'
import { sign } from 'jsonwebtoken'
import { loginMiddleware, checkDuplicateUsernameOrEmail } from '../middlewares'
import { User } from '../models'
import { SECRET_KEY } from '../config/constant.config'

export const authRouter = Router()

authRouter.post('/login', loginMiddleware, async (req, res) => {
  try {
    if (req.user) {
      res.status(201).send(
        sign({ data: req.body.username }, SECRET_KEY, {
          expiresIn: '1h',
        }),
      )
    }
  } catch {
    res.status(500)
  }
})

authRouter.post(
  '/signup',
  checkDuplicateUsernameOrEmail,
  async (req: Request, res: Response) => {
    const payload = req.body
    try {
      const newUser = new User({
        username: payload.username,
        password: payload.password,
        email: payload.email,
      })
      newUser.setPassword(payload.password)
      await newUser.save()
      res.status(201).end()
    } catch (error) {
      res.status(400).json(error)
    }
  },
)
