import { schedule } from 'node-cron'
import { JOB_SCHEDULE } from '../config/constant.config'
import { TimeSlot } from '../models/timeSlot'
import { generateDateTimeSlots } from '../utils/timeSlot'

schedule(JOB_SCHEDULE, async () => {
  const newVal = generateDateTimeSlots(new Date())
  console.log(`add ${newVal.length} to TimeSlot collection`)
  await TimeSlot.insertMany(newVal)
})
