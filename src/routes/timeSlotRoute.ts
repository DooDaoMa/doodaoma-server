import { Router } from 'express'
import { middleware as paginateMiddleware } from 'express-paginate'
import { parseISO } from 'date-fns'
import { TimeSlot } from '../models/timeSlot'
import { generateDateTimeSlots } from '../utils/timeSlot'

export const timeSlotRouter = Router()

timeSlotRouter.use(paginateMiddleware(10, 50))

timeSlotRouter.get('/timeslots', async (req, res) => {
  const startTime = req.query.startTime || null
  const endTime = req.query.endTime || null

  try {
    const query = {
      ...(startTime !== null && { startTime: { $gte: startTime } }),
      ...(endTime !== null && { endTime: { $lte: endTime } }),
    }
    const [results, itemCount] = await Promise.all([
      TimeSlot.find(query).lean().exec(),
      TimeSlot.count({}),
    ])
    if (results) {
      return res.status(200).json({
        data: results,
        itemCount,
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
