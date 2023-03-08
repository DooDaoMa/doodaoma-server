import { Router, Request, Response } from 'express'
import {
  middleware as paginateMiddleware,
  getArrayPages,
} from 'express-paginate'
import { requireJWTAuth } from '../config/jwt.config'
import { checkDeviceExist } from '../middlewares/device.middleware'
import { checkReservationPeriod } from '../middlewares/reservation.middleware'
import { Reservation } from '../models/reservation'
import { getISOString } from '../utils/datetime'
// import { generateDateTimeSlots } from '../utils/timeSlot'

export const reservationRouter = Router()

reservationRouter.use(paginateMiddleware(10, 50))

reservationRouter.get('/reservations', async (req, res) => {
  const limit = +(req.query.limit || 10)
  const skip = +(req.skip || 0)
  const page = +(req.query.skip || 1)
  const startTime = req.query.startTime || null
  const endTime = req.query.endTime || null
  const status = req.query.status || 'available'
  const userId = req.query.userId || ''
  try {
    // const user = await User.findById(userId)
    const query = {
      ...(startTime !== null && { startTime: { $gte: startTime } }),
      ...(endTime !== null && { endTime: { $lte: endTime } }),
      status,
    }
    console.log('query', query)
    const [results, itemCount] = await Promise.all([
      Reservation.find(query)
        .populate({ path: 'user', match: { _id: userId } })
        .limit(limit)
        .skip(skip)
        .lean()
        .exec(),
      Reservation.count(query),
    ])
    const pageCount = Math.ceil(itemCount / limit)
    if (results.length > 0) {
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
