import mongoose from 'mongoose'

// Set up default mongoose connection
const mongoDB = 'mongodb://localhost:27017/doodaoma'
mongoose.connect(mongoDB, {})

// Get the default connection
export const db = mongoose.connection

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
