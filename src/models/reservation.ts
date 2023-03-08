import { Schema } from 'mongoose'
import { db } from '../config/database.config'
import { IReservation } from '../types/reservation.types'

const ReservationSchema = new Schema<IReservation>(
  {
    username: {
      type: String,
      required: true,
    },
    deviceId: {
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
    status: {
      type: String,
      default: 'available',
    },
  },
  { timestamps: true },
)

export const Reservation = db.model<IReservation>(
  'Reservation',
  ReservationSchema,
)
