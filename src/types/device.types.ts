import { Types } from 'mongoose'

export interface IDevice {
  _id: Types.ObjectId
  deviceId: string
  name: string
  description: string
  driverInfo: string
  driverVersion: string
}
