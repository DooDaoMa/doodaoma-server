import { schedule } from 'node-cron'
import { startOfToday, addDays } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { TimeSlot } from '../models/timeSlot'
import { generateDateTimeSlots } from '../utils/timeSlot'
import {
  CREATE_TIMESLOT_SCHEDULE,
  DELETE_TIMESLOT_SCHEDULE,
  CREATE_SCHEDULE_DATE,
} from '../config/constant.config'

const timeZone = 'Asia/Bangkok'

schedule(CREATE_TIMESLOT_SCHEDULE, async () => {
  const newTimeSlot = []
  const createNum = Number(CREATE_SCHEDULE_DATE)
  if (createNum < 0) return

  const date = addDays(new Date(), createNum)
  const zonedDate = utcToZonedTime(date, timeZone)
  newTimeSlot.push(...generateDateTimeSlots(zonedDate))
  // for (let i = 0; i < createNum; i++) {
  //   const date = addDays(new Date(), i)
  //   const zonedDate = utcToZonedTime(date, timeZone)
  //   newTimeSlot.push(...generateDateTimeSlots(zonedDate))
  // }
  try {
    await TimeSlot.insertMany(newTimeSlot)
    console.log(
      `add ${newTimeSlot.length} time slot from ${newTimeSlot[0].startTime} - ${
        newTimeSlot[newTimeSlot.length - 1].endTime
      } to TimeSlot collection`,
    )
  } catch (error) {
    console.error(error)
  }
})

schedule(DELETE_TIMESLOT_SCHEDULE, async () => {
  const query = {
    endTime: { $lte: startOfToday() },
  }
  try {
    const yesterdaySlot = await TimeSlot.find(query)
    if (yesterdaySlot) {
      const deletedSlot = await TimeSlot.deleteMany(query)
      console.log(`remove ${deletedSlot.deletedCount} from TimeSlot collection`)
    } else {
      console.log("there're no any time slots in yesterday")
    }
  } catch (error) {
    console.error(error)
  }
})
