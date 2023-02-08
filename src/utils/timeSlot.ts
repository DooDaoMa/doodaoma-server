import {
  isBefore,
  setHours,
  setMinutes,
  setSeconds,
  addMinutes,
  setMilliseconds,
  format,
} from 'date-fns'

export const setTime = (x: Date, h = 0, m = 0, s = 0, ms = 0): Date => {
  return setHours(setMinutes(setSeconds(setMilliseconds(x, ms), s), m), h)
}

export const generateDateTimeSlots = (date: Date) => {
  const from = setTime(date, 0)
  const to = setTime(date, 24)
  const step = (x: Date): Date => addMinutes(x, 120)

  const blocks = []
  let cursor = from

  while (isBefore(cursor, to)) {
    blocks.push({
      startTime: format(cursor, 'dd MM yyyy kk:mm'),
      endTime: format(step(cursor), 'dd MM yyyy kk:mm'),
    })
    cursor = step(cursor)
  }
  return blocks
}
