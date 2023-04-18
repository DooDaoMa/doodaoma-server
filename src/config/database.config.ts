import mongoose from 'mongoose'
import { MONGODB_URL } from './constant.config'

mongoose.connect(MONGODB_URL, {
  dbName: 'doodaoma',
})

export const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

require('../models/device')
require('../models/user')
require('../models/image')
