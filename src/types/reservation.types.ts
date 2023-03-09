import { IUser } from './user.types'

export interface IReservation {
  user: IUser
  deviceId: String
  startTime: Date
  endTime: Date
  status: string
}
