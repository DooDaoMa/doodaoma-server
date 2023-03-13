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
  const from = setTime(date, 16)
  const to = setTime(date, 24)
  const step = (x: Date): Date => addMinutes(x, 60)

  const blocks = []
  let cursor = from

  while (isBefore(cursor, to)) {
    blocks.push({
      startTime: cursor,
      endTime: step(cursor),
    })
    cursor = step(cursor)
  }
  return blocks
}
