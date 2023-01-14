import { Router } from 'express'
import { requireJWTAuth } from '../config/jwt.config'

export const accountRouter = Router()

accountRouter.get('/', requireJWTAuth, (req, res) => {
  if (req.user) {
    res.status(200).send({
      username: req.user.username,
      email: req.user.email,
    })
  }
})
