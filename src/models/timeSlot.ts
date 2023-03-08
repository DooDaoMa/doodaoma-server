import { Schema } from 'mongoose'
import { db } from '../config/database.config'
import { ITimeSlot } from '../types/timeSlot.types'

const TimeSlotSchema = new Schema<ITimeSlot>({
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    default: null,
  },
})

export const TimeSlot = db.model<ITimeSlot>('TimeSlot', TimeSlotSchema)
