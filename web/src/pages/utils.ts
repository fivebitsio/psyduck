import type { ChartData, Precision } from '@/pages/analytics/metrics'

export function fillGapsInData(
  data: ChartData[],
  from: string,
  to: string,
  precision: Precision
): ChartData[] {
  if (data.length === 0) return []

  const start = new Date(from)
  const end = new Date(to)
  const filled: ChartData[] = []

  const normalizeDate = (date: Date, precision: Precision): Date => {
    const d = new Date(date)
    switch (precision) {
      case 'minute':
        d.setSeconds(0, 0)
        return d
      case 'hour':
        d.setMinutes(0, 0, 0)
        return d
      case 'day':
        d.setHours(0, 0, 0, 0)
        return d
      case 'week': {
        // Match backend: start of week on Monday (1)
        // Use the exact same logic as your backend
        d.setHours(0, 0, 0, 0)
        const day = d.getDay()
        // Calculate days to go back to Monday (or forward if it's Sunday)
        const daysToMonday = day === 0 ? 6 : day - 1
        d.setDate(d.getDate() - daysToMonday)
        return d
      }
      case 'month':
        d.setDate(1)
        d.setHours(0, 0, 0, 0)
        return d
      default:
        return d
    }
  }

  const normalizedStart = normalizeDate(start, precision)
  const normalizedEnd = normalizeDate(end, precision)
  const current = new Date(normalizedStart)

  const incrementMap = {
    minute: () => current.setMinutes(current.getMinutes() + 1),
    hour: () => current.setHours(current.getHours() + 1),
    day: () => current.setDate(current.getDate() + 1),
    week: () => current.setDate(current.getDate() + 7),
    month: () => current.setMonth(current.getMonth() + 1)
  }

  const formatMap = {
    minute: (d: Date) => {
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const hour = String(d.getHours()).padStart(2, '0')
      const minute = String(d.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hour}:${minute}`
    },
    hour: (d: Date) => {
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const hour = String(d.getHours()).padStart(2, '0')
      return `${year}-${month}-${day} ${hour}:00`
    },
    day: (d: Date) => {
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    week: (d: Date) => {
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    month: (d: Date) => {
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      return `${year}-${month}`
    }
  }

  const increment = incrementMap[precision]
  const formatDate = formatMap[precision]

  if (!increment || !formatDate) {
    console.warn(`Unsupported precision: ${precision}`)
    return data
  }

  const existingDates = new Set(data.map(item => item.date))
  data.forEach(item => {
    filled.push(item)
  })

  const generatedDates: string[] = []
  while (current <= normalizedEnd) {
    const dateKey = formatDate(current)
    generatedDates.push(dateKey)

    if (!existingDates.has(dateKey)) {
      filled.push({
        date: dateKey,
        pageviews: 0,
        visitors: 0,
        bounces: 0
      })
    }

    increment()
  }

  filled.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return filled
}
