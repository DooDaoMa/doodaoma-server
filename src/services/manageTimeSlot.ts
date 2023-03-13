import { schedule } from 'node-cron'
import { startOfYesterday, endOfYesterday, addDays } from 'date-fns'
import { TimeSlot } from '../models/timeSlot'
import { generateDateTimeSlots } from '../utils/timeSlot'

schedule('0 0 * * 2', async () => {
  const newTimeSlot = []
  for (let i = 0; i < 7; i++) {
    newTimeSlot.push(...generateDateTimeSlots(addDays(new Date(), i)))
  }
  try {
    await TimeSlot.insertMany(newTimeSlot)
    console.log(
      `add ${newTimeSlot.length} time slot from ${newTimeSlot[0]} - ${
        newTimeSlot[newTimeSlot.length - 1]
      } to TimeSlot collection`,
    )
  } catch (error) {
    console.error(error)
  }
})

schedule('0 0 * * *', async () => {
  const query = {
    startTime: { $gte: startOfYesterday() },
    endTime: { $lte: endOfYesterday() },
  }
  try {
    const yesterdaySlot = await TimeSlot.find(query)
    if (yesterdaySlot) {
      await TimeSlot.deleteMany(yesterdaySlot)
      console.log(
        `remove ${
          yesterdaySlot[yesterdaySlot.length]
        } from TimeSlot collection`,
      )
    }
    console.log("there're no any time slots in yesterday")
  } catch (error) {
    console.error(error)
  }
})
