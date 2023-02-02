import mongoose from 'mongoose'
import { DATABASE_URL, MONGODB_URL } from './constant.config'

// Set up default mongoose connection
mongoose.connect(MONGODB_URL, {
  dbName: 'doodaoma',
})

// Get the default connection
export const db = mongoose.connection

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
