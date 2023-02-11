import { Router } from 'express'
import { requireJWTAuth } from '../config/jwt.config'
import { Device } from '../models/device'

const devicesRouter = Router()

devicesRouter.get('/devices', requireJWTAuth, async (req, res) => {
  try {
    const devices = await Device.find()
    res.status(200).json(devices)
  } catch (error) {
    res.status(500).json({ message: error })
  }
})

export { devicesRouter }
