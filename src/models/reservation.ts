import { Schema, Model } from 'mongoose'
import { db } from '../config/database.config'
import { IReservation } from '../types/reservation.types'

const ReservationSchema = new Schema<IReservation>({
  username: {
    type: String,
    required: true,
  },
  telescopeId: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
})

export const Reservation = db.model<IReservation>(
  'Reservation',
  ReservationSchema,
)
