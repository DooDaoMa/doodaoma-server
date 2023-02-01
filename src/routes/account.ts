import { Router } from 'express'
import {
  middleware as paginateMiddleware,
  getArrayPages,
} from 'express-paginate'
import { requireJWTAuth } from '../config/jwt.config'
import { User } from '../models/user'
import { IUser } from '../types/user.types'

export const accountRouter = Router()

accountRouter.use(paginateMiddleware(10, 50))

accountRouter.get('/account', requireJWTAuth, (req, res) => {
  const user = req.user as IUser
  if (user) {
    res.status(200).send({
      username: user.username,
      email: user.email,
    })
  }
})

accountRouter.get('/accounts', requireJWTAuth, async (req, res, next) => {
  const limit = +(req.query.limit || 10)
  const skip = +(req.skip || 0)
  const page = +(req.query.page || 1)
  try {
    const [results, itemCount] = await Promise.all([
      User.find({}).limit(limit).skip(skip).lean().exec(),
      User.count({}),
    ])

    const pageCount = Math.ceil(itemCount / limit)
    if (results) {
      res.status(200).send({
        data: results.map((user: IUser) => ({
          username: user.username,
          email: user.email,
        })),
        pageCount,
        itemCount,
        pages: getArrayPages(req)(3, pageCount, page),
      })
    }
  } catch (err) {
    next(err)
  }
})
