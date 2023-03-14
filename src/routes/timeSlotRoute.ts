import { Router } from 'express'
import {
  getArrayPages,
  middleware as paginateMiddleware,
} from 'express-paginate'
import { addDays, parseISO } from 'date-fns'
import { TimeSlot } from '../models/timeSlot'
import { generateDateTimeSlots } from '../utils/timeSlot'

export const timeSlotRouter = Router()

timeSlotRouter.use(paginateMiddleware(10, 50))

timeSlotRouter.get('/timeslots', async (req, res) => {
  const limit = +(req.query.limit || 10)
  const skip = +(req.skip || 0)
  const page = +(req.query.skip || 1)
  const startTime = req.query.startTime || null
  const endTime = req.query.endTime || null

  try {
    const query = {
      ...(startTime !== null && { startTime: { $gte: startTime } }),
      ...(endTime !== null && { endTime: { $lte: endTime } }),
    }
    const [results, itemCount] = await Promise.all([
      TimeSlot.find(query).limit(limit).skip(skip).lean().exec(),
      TimeSlot.count({}),
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
    return res.status(404).json({ message: 'There are no any time slots' })
  } catch (error) {
    return res.status(500).json(error)
  }
})

timeSlotRouter.post('/timeslot', async (req, res) => {
  const addDate = parseISO(req.body.date) || new Date()
  const newTimeSlot = generateDateTimeSlots(addDate)
  try {
    const created = await TimeSlot.insertMany(newTimeSlot)
    if (created) {
      return res.status(201).json(created)
    }
  } catch (error) {
    return res.status(500).json({ message: error })
  }
})
