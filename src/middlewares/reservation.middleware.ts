import { Request, Response, NextFunction } from 'express'
import { Reservation } from '../models/reservation'

export const checkReservationPeriod = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Check if there are duplicated reservation time
  const { startTime, endTime } = req.body
  try {
    const reservation = await Reservation.findOne({ startTime })
    if (reservation) {
      res.status(400).json({
        message: `Failed! time range ${startTime} - ${endTime} is reserved`,
      })
      next()
    }
  } catch (err) {
    res.status(500).json({ message: err })
    return
  }
}
