import { schedule } from 'node-cron'
import { startOfYesterday, endOfYesterday } from 'date-fns'
import { TimeSlot } from '../models/timeSlot'
import { generateDateTimeSlots } from '../utils/timeSlot'

schedule('0 0 * * 0', async () => {
  const newTimeSlot = generateDateTimeSlots(new Date())
  console.log(
    `add ${newTimeSlot.length} time slot from ${newTimeSlot[0]} - ${
      newTimeSlot[newTimeSlot.length - 1]
    } to TimeSlot collection`,
  )
  await TimeSlot.insertMany(newTimeSlot)
})
