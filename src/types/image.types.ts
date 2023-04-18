import { Types } from 'mongoose'
import { IUser } from './user.types'

export interface IImage {
  _id: Types.ObjectId
  name: string
  userId: string
  displayName: string
  user?: IUser
  createdAt: string
}
