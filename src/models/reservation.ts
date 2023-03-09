import { Schema } from 'mongoose'
import { db } from '../config/database.config'
import { IReservation } from '../types/reservation.types'

const ReservationSchema = new Schema<IReservation>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    deviceId: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
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
