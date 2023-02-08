import { Router, Request, Response } from 'express'
import {
  middleware as paginateMiddleware,
  getArrayPages,
} from 'express-paginate'
import { requireJWTAuth } from '../config/jwt.config'
import { checkDeviceExist } from '../middlewares/device.middleware'
import { checkReservationPeriod } from '../middlewares/reservation.middleware'
import { Reservation } from '../models/reservation'
// import { generateDateTimeSlots } from '../utils/timeSlot'

export const reservationRouter = Router()

reservationRouter.use(paginateMiddleware(10, 50))

// reservationRouter.get('/time-slot', (req, res) => {
//   const date = new Date(new Date())
//   date.setDate(date.getDate() + 2)
//   res.status(200).send(generateDateTimeSlots(date))
// })

reservationRouter.get('/reservations', async (req, res) => {
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
      return res.status(200).json({
        data: results,
        pageCount,
        itemCount,
        pages: getArrayPages(req)(3, pageCount, page),
      })
    }
    return res.status(404).json({ message: 'There are no any reservation' })
  } catch (error) {
    return res.status(500).json(error)
  }
})

reservationRouter.get('/reservation/:id', requireJWTAuth, async (req, res) => {
  const _id = req.params.id
  try {
    const reservation = await Reservation.findById(_id).lean()
    if (reservation) {
      return res.status(200).json({
        ...reservation,
      })
    }
    return res.status(404).json({ message: `There is no document id ${_id}` })
  } catch (error) {
    return res.status(500).json(error)
  }
})

reservationRouter.post(
  '/reservation',
  [requireJWTAuth, checkDeviceExist, checkReservationPeriod],
  async (req: Request, res: Response) => {
    const payload = req.body
    try {
      const newReservation = new Reservation({ ...payload })
      await newReservation.save()
      return res.status(200).json(newReservation)
    } catch (error) {
      return res.status(404).json({ message: error })
    }
  },
)

reservationRouter.delete(
  '/reservation/:id',
  requireJWTAuth,
  async (req, res) => {
    const _id = req.params.id
    try {
      const reservation = await Reservation.deleteOne({ _id })
      if (reservation.deletedCount > 0) {
        return res.status(200).json({ message: 'success' })
      }
      return res.status(404).json({ message: `There is no document id ${_id}` })
    } catch (error) {
      return res.status(500).json({ message: error })
    }
  },
)