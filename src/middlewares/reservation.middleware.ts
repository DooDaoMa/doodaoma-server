import { Request, Response, NextFunction } from 'express'
import { Reservation } from '../models/reservation'

export const checkReservationPeriod = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Check if there are duplicated reservation time
  const { startTime, endTime, deviceId } = req.body
  try {
    const query = {
      deviceId,
      startTime: { $gte: startTime },
      endTime: { $lte: endTime },
    }
    const reservationList = await Reservation.find(query)
    if (reservationList.length > 0) {
      return res.status(400).json({
        message: `Failed! time range ${startTime} - ${endTime} is reserved`,
      })
    }
    req.body = {
      ...req.body,
      startTime,
      endTime,
    }
    next()
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}
