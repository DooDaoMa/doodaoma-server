import { Schema } from 'mongoose'
import { db } from '../config/database.config'
import { ITimeSlot } from '../types/timeSlot.types'

const TimeSlotSchema = new Schema<ITimeSlot>({
  startTime: String,
  endTime: String,
})

export const TimeSlot = db.model<ITimeSlot>('TimeSlot', TimeSlotSchema)
