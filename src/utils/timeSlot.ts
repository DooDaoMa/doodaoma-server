import {
  isBefore,
  setHours,
  setMinutes,
  setSeconds,
  addMinutes,
  setMilliseconds,
  addDays,
} from 'date-fns'

export const setTime = (x: Date, h = 0, m = 0, s = 0, ms = 0): Date => {
  return setHours(setMinutes(setSeconds(setMilliseconds(x, ms), s), m), h)
}

export const generateDateTimeSlots = (date: Date) => {
  // from 6 p.m. to 6 a.m.
  const from = setTime(date, 18)
  const to = setTime(addDays(date, 1), 6)
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
