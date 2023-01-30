import crypto from 'crypto'
import { Schema, Model } from 'mongoose'
import { db } from '../config/database.config'
import { IUser, IUserMethods } from '../types/user.types'

// Define a schema
const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  email: String,
  hash: String,
  salt: String,
})

// Method to set salt and hash the password for a user
UserSchema.method('setPassword', function (password: string) {
  // Creating a unique salt for a particular user
  this.salt = crypto.randomBytes(16).toString('hex')

  // Hashing user's salt and password with 1000 iterations,

  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
    .toString(`hex`)
})

// Method to check the entered password is correct or not
UserSchema.method('validPassword', function (password: string) {
  const hash: string = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
    .toString(`hex`)
  return this.hash === hash
})

type UserModel = Model<IUser, {}, IUserMethods>

// Compile model from schema
export const User = db.model<IUser, UserModel>('User', UserSchema)
