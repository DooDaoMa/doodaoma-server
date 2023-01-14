import dotenv from 'dotenv'

dotenv.config()

export const SECRET_KEY = process.env.SECRET_KEY || 'SECRET'
export const PORT = process.env.PORT || 8000
