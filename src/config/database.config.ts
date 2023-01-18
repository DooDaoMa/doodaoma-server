import mongoose from 'mongoose'

// Set up default mongoose connection
const mongoDB =
  'mongodb://mongo:8SOkYupuad0NBIl3ZtMs@containers-us-west-87.railway.app:7231'
mongoose.connect(mongoDB, {
  dbName: 'doodaoma',
})

// Get the default connection
export const db = mongoose.connection

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
