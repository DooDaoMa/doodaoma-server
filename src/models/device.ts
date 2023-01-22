import { Schema } from 'mongoose'
import { db } from '../config/database.config'
import { IDevice } from '../types/device.types'

const DeviceSchema = new Schema<IDevice>({
  deviceId: String,
  name: String,
  description: String,
  driverInfo: String,
  driverVersion: String,
  isConnected: Boolean,
})

export const Device = db.model<IDevice>('Device', DeviceSchema)
