import { Router } from 'express'
import { requireJWTAuth } from '../config/jwt.config'
import { IUser } from 'types/user.types'

export const accountRouter = Router()

accountRouter.get('/', requireJWTAuth, (req, res) => {
  const user = req.user as IUser
  if (user) {
    res.status(200).send({
      username: user.username,
      email: user.email,
    })
  }
})
