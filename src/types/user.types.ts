import { Types } from 'mongoose'
import { IImage } from './image.types'

export interface IUser {
  _id: Types.ObjectId
  username: string
  email: string
  hash?: string
  salt?: string
  images?: IImage[]
}

export interface IUserMethods {
  validPassword: (arg0: string) => boolean
  setPassword: (arg0: string) => void
}
