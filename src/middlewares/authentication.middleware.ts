import { Request, Response, NextFunction } from 'express'
import { User } from '../models'

export const loginMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = await User.findOne({ username: req.body.username })
  if (user) next()
  else res.send('Wrong username and password')
}
export const checkDuplicateUsernameOrEmail = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Username
  User.findOne({
    username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err })
      return
    }

    if (user) {
      res.status(400).send({ message: 'Failed! Username is already in use!' })
      return
    }
  })

  // Email
  User.findOne({
    email: req.body.email,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err })
      return
    }

    if (user) {
      res.status(400).send({ message: 'Failed! Email is already in use!' })
      return
    }
    next()
  })
}
