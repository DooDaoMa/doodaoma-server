import { Request, Response, NextFunction } from 'express'
import { Device } from '../models/device'

export const checkDeviceExist = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { deviceId } = req.body
  try {
    const device = await Device.findOne({ deviceId })
    if (!device) {
      return res
        .status(404)
        .json({ message: `There is no device id ${deviceId}` })
    }
    next()
  } catch (error) {
    return res.status(500).json({ message: error })
  }
}
