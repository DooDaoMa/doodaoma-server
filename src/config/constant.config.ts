import dotenv from 'dotenv'

dotenv.config()

export const SECRET_KEY = process.env.SECRET_KEY || 'SECRET'
export const PORT = process.env.PORT || 8000
export const MONGODB_URL =
  process.env.MONGODB_URL || 'mongodb://localhost:27017'
export const IS_DEBUG = process.env.NODE_ENV !== 'production'
