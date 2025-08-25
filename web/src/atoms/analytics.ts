import { atom } from 'jotai'

export interface DateRange {
  from: Date
  to: Date
}

const now = new Date()
const aMonthAgo = new Date(now)
aMonthAgo.setDate(now.getDate() - 30)

export const calendarRangeAtom = atom<DateRange>({
  from: aMonthAgo,
  to: now,
})

export const formattedRangeAtom = atom((get) => {
  const range = get(calendarRangeAtom)
  return `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
})
