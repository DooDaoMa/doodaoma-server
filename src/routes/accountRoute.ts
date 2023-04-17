import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Router } from 'express'
import {
  middleware as paginateMiddleware,
  getArrayPages,
} from 'express-paginate'
import { BUCKET_NAME } from '../config/constant.config'
import { requireJWTAuth } from '../config/jwt.config'
import { s3Client } from '../config/s3.config'
import { User } from '../models/user'
import { IUser } from '../types/user.types'

export const accountRouter = Router()

accountRouter.use(paginateMiddleware(10, 50))

accountRouter.get('/account', requireJWTAuth, (req, res) => {
  const user = req.user as IUser
  if (user) {
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
    })
  }
})

accountRouter.get('/account/images', requireJWTAuth, async (req, res) => {
  try {
    const userId = (req.user as IUser)._id
    const user = await User.findById(userId).populate('images')
    if (!user) {
      return res.status(404).json({ message: `Not found user id ${userId}` })
    }
    const images = await Promise.all(
      user.images?.map(async (image) => {
        const getCommand = new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: `${image.userId}/${image.name}`,
        })
        const signedUrl = await getSignedUrl(s3Client, getCommand, {
          expiresIn: 60 * 60,
        })
        return { id: image._id, name: image.name, imageUrl: signedUrl }
      }) || [],
    )
    res.status(200).json(images)
  } catch (error) {
    res.status(500).json({ message: error })
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
        data: results.map((user) => ({
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
