import { Router, Request, Response } from 'express'
import {
  middleware as paginateMiddleware,
  getArrayPages,
} from 'express-paginate'
import { requireJWTAuth } from '../config/jwt.config'
import { checkReservationPeriod } from '../middlewares/reservation.middleware'
import { Reservation } from '../models/reservation'

export const reservationRouter = Router()

reservationRouter.use(paginateMiddleware(10, 50))

reservationRouter.get('/reservations', async (req, res, next) => {
  const limit = +(req.query.limit || 10)
  const skip = +(req.skip || 0)
  const page = +(req.query.skip || 1)
  try {
    const [results, itemCount] = await Promise.all([
      Reservation.find({}).limit(limit).skip(skip).lean().exec(),
      Reservation.count({}),
    ])
    const pageCount = Math.ceil(itemCount / limit)
    if (results) {
      res.status(200).send({
        data: results,
        pageCount,
        itemCount,
        pages: getArrayPages(req)(3, pageCount, page),
      })
    }
  } catch (err) {
    next(err)
  }
})

reservationRouter.get(
  '/reservation',
  requireJWTAuth,
  async (req, res, next) => {
    const id = +(req.body || 0)
    try {
      const reservation = await Reservation.findById({ _id: id })
      if (reservation) {
        res.status(200).send({
          ...reservation,
        })
      }
    } catch (err) {
      next(err)
    }
  },
)

reservationRouter.post(
  '/reservation',
  [requireJWTAuth, checkReservationPeriod],
  async (req: Request, res: Response) => {
    const payload = req.body
    try {
      const newReservation = new Reservation({
        username: payload.username,
        telescopeId: payload.telescopeId,
        createdAt: Date.now(),
        startTime: payload.startTime,
        endTime: payload.endTime,
      })
      await newReservation.save()
      res.status(200).json(newReservation)
    } catch (error) {
      res.status(404).json({ message: error })
    }
  },
)

reservationRouter.delete('/reservation', requireJWTAuth, async (req, res) => {
  const { startTime, endTime } = req.body
  try {
    await Reservation.deleteOne({ startTime, endTime })
  } catch (error) {
    res.status(404).json({ message: error })
  }
})
