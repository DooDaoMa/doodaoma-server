import { Request, Response, NextFunction } from 'express'
import { Reservation } from '../models/reservation'
import { getISOString } from '../utils/datetime'
// import { isBefore, parseISO, format, isAfter } from 'date-fns'
// import { generateDateTimeSlots, setTime } from '../utils/timeSlot'

// const date = new Date(new Date())
// date.setDate(date.getDate() + 2)
// const timeSlot = generateDateTimeSlots(date)

export const checkReservationPeriod = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Check if there are duplicated reservation time
  const { startTime, endTime, deviceId } = req.body
  const parsedStartTime = Date.parse(startTime)
  const parsedEndTime = Date.parse(endTime)
  try {
    const query = {
      deviceId,
      startTime: { $gte: getISOString(parsedStartTime) },
      endTime: { $lte: getISOString(parsedEndTime) },
    }
    const reservationList = await Reservation.find(query)
    if (reservationList.length > 0) {
      return res.status(400).json({
        message: `Failed! time range ${startTime} - ${endTime} is reserved`,
      })
    }
    req.body = {
      ...req.body,
      startTime: getISOString(parsedStartTime),
      endTime: getISOString(parsedEndTime),
    }
    next()
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}