import crypto from 'crypto'
import { Schema, Model } from 'mongoose'
import { db } from '../config/database.config'
import { IUser, IUserMethods } from '../types/user.types'

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
    },
    email: String,
    hash: String,
    salt: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

UserSchema.virtual('images', {
  ref: 'Image',
  localField: '_id',
  foreignField: 'userId',
})

UserSchema.method('setPassword', function (password: string) {
  this.salt = crypto.randomBytes(16).toString('hex')

  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
    .toString(`hex`)
})

UserSchema.method('validPassword', function (password: string) {
  const hash: string = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
    .toString(`hex`)
  return this.hash === hash
})

type UserModel = Model<IUser, {}, IUserMethods>

export const User = db.model<IUser, UserModel>('User', UserSchema)
