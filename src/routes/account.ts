import { Router } from 'express'
import { requireJWTAuth } from '../config/jwt.config'
import { User } from '../models/user'
import { IUser } from 'types/user.types'

export const accountRouter = Router()

accountRouter.get('/account', requireJWTAuth, (req, res) => {
  const user = req.user as IUser
  if (user) {
    res.status(200).send({
      username: user.username,
      email: user.email,
    })
  }
})

accountRouter.get('/accounts', requireJWTAuth, async (req, res) => {
  const userList = await User.find({})
  if (userList) {
    res.status(200).send({
      data: userList.map((user: IUser) => ({
        username: user.username,
        email: user.email,
      })),
    })
  }
})
