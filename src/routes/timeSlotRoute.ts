import { Router } from 'express'
import { middleware as paginateMiddleware } from 'express-paginate'
import { parseISO } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { TimeSlot } from '../models/timeSlot'
import { generateDateTimeSlots } from '../utils/timeSlot'

export const timeSlotRouter = Router()

timeSlotRouter.use(paginateMiddleware(10, 50))

timeSlotRouter.get('/timeslots', async (req, res) => {
  const startTime = req.query.startTime || null
  const endTime = req.query.endTime || null

  const username = req.query.username || null
  const status = req.query.status || null

  try {
    const query = {
      ...(startTime !== null && { startTime: { $gte: startTime } }),
      ...(endTime !== null && { endTime: { $lte: endTime } }),
      ...(username !== null && { username }),
      ...(status !== null && { status }),
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

timeSlotRouter.get('/timeslot/now', async (req, res) => {
  const now = new Date()

  if (now.getHours() < 16 || now.getHours() > 6)
    return res.status(404).json({ message: 'out of service time' })
  try {
    const query = {
      startTime: {
        $gte: now.getTime(),
      },
      endTime: {
        $lte: now.getTime(),
      },
    }
    const currentTimeSlot = await TimeSlot.findOne(query)
    if (currentTimeSlot) {
      return res.status(200).json({ data: currentTimeSlot })
    }
  } catch (error) {
    return res.status(500).json(error)
  }
})

timeSlotRouter.post('/timeslot', async (req, res) => {
  const addDate = parseISO(req.body.date) || new Date()
  const timeZone = 'Asia/Bangkok'
  const zonedDate = utcToZonedTime(addDate, timeZone)
  const newTimeSlot = generateDateTimeSlots(zonedDate)
  try {
    const created = await TimeSlot.insertMany(newTimeSlot)
    if (created) {
      return res.status(201).json(created)
    }
  } catch (error) {
    return res.status(500).json({ message: error })
  }
})

timeSlotRouter.put('/timeslot', async (req, res) => {
  const toUpdatedList = req.body.updatedList || []
  const username = req.body.username
  const status = req.body.status
  try {
    const updatedTimeSlot = await TimeSlot.updateMany(
      { _id: { $in: toUpdatedList } },
      { $set: { status, username } },
    )
    if (updatedTimeSlot.matchedCount > 0) {
      return res.status(200).json({ message: updatedTimeSlot })
    }
    return res.status(404).json({ message: 'There is no any time slot' })
  } catch (error) {
    return res.status(500).json({ message: error })
  }
})
