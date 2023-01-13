import { Request, Response, NextFunction } from 'express'
import { User } from '../models/user'

export const loginMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    if (user) {
      if (user.validPassword(req.body.password)) {
        req.user = user
        next()
      } else {
        return res.status(400).json({
          message: 'Wrong Password',
        })
      }
    } else {
      return res.status(400).json({
        message: 'User not found.',
      })
    }
  } catch (err) {
    return res.status(500).json({ message: err })
  }
}
export const checkDuplicateUsernameOrEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Check duplicate username
  try {
    const user = await User.findOne({ username: req.body.username })
    if (user) {
      res.status(400).json({ message: 'Failed! Username is already in use!' })
      return
    }
  } catch (err) {
    res.status(500).json({ message: err })
    return
  }
  // Check duplicate email
  try {
    const user = await User.findOne({ username: req.body.email })
    if (user) {
      res.status(400).json({ message: 'Failed! Email is already in use!' })
      return
    }
  } catch (err) {
    res.status(500).json({ message: err })
    return
  }
  next()
}
