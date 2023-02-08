import { Router } from 'express'
import {
  getArrayPages,
  middleware as paginateMiddleware,
} from 'express-paginate'
import { TimeSlot } from '../models/timeSlot'
import { generateDateTimeSlots } from '../utils/timeSlot'

const timeSlotRouter = Router()

timeSlotRouter.use(paginateMiddleware(10, 50))

timeSlotRouter.get('/timeslots', async (req, res) => {
  const limit = +(req.query.limit || 10)
  const skip = +(req.skip || 0)
  const page = +(req.query.skip || 1)

  try {
    const [results, itemCount] = await Promise.all([
      TimeSlot.find({}).limit(limit).skip(skip).lean().exec(),
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
  } catch (error) {
    return res.status(500).json(error)
  }
})

timeSlotRouter.post('/timeslot', async (req, res) => {
  const newVal = generateDateTimeSlots(new Date())
  console.log(`add ${newVal.length} to TimeSlot collection`)
  await TimeSlot.insertMany(newVal)
  return res.status(201).send(newVal)
})

export { timeSlotRouter }
