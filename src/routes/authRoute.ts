import { Router } from 'express'
import { sign } from 'jsonwebtoken'
import {
  loginMiddleware,
  checkDuplicateUsernameOrEmail,
} from '../middlewares/authentication.middleware'
import { User } from '../models/user'
import { SECRET_KEY } from '../config/constant.config'

const authRouter = Router()

authRouter.post('/login', loginMiddleware, async (req, res) => {
  try {
    if (req.user) {
      res.status(201).json({
        token: sign({ data: req.body.username }, SECRET_KEY, {
          expiresIn: '1d',
        }),
      })
    }
  } catch (err) {
    res.status(500).json({ message: err })
  }
})

authRouter.post('/signup', checkDuplicateUsernameOrEmail, async (req, res) => {
  const payload = req.body
  try {
    const newUser = new User({
      username: payload.username,
      password: payload.password,
      email: payload.email,
    })
    newUser.setPassword(payload.password)
    await newUser.save()
    res.status(201).json({ message: 'success' })
  } catch (error) {
    res.status(400).json({ message: error })
  }
})

export { authRouter }
