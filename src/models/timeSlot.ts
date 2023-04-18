import { Schema } from 'mongoose'
import { db } from '../config/database.config'
import { ITimeSlot } from '../types/timeSlot.types'

const TimeSlotSchema = new Schema<ITimeSlot>({
  startTime: {
    type: Date,
    required: true,
    unique: true,
  },
  endTime: {
    type: Date,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    default: 'available',
  },
})

export const TimeSlot = db.model<ITimeSlot>('TimeSlot', TimeSlotSchema)
