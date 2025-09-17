import type { ChartConfig } from '@/components/ui/chart'
import { useAtomValue } from 'jotai'
import { Loader } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { calendarRangeAtom } from '@/atoms/analytics'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {

  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import api from '@/lib/api'
import { fillGapsInData } from '../utils'

export interface ChartData {
  date: string
  pageviews: number
  visitors: number
  bounces: number
}

export type Precision = 'minute' | 'hour' | 'day' | 'week' | 'month'

const chartConfig = {
  pageviews: {
    label: 'Views',
    color: 'var(--chart-1)',
  },
  visitors: {
    label: 'Visitors',
    color: 'var(--chart-2)',
  },
  bounces: {
    label: 'Bounces',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig

function Metrics() {
  const [activeChart, setActiveChart]
    = useState<keyof typeof chartConfig>('pageviews')
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [fetching, setFetching] = useState<boolean>(false)

  const range = useAtomValue(calendarRangeAtom)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setFetching(true)
        const from = range.from.toISOString()
        const to = range.to.toISOString()
        const precision: Precision = 'day'

        const metrics = await api<undefined, ChartData[]>({
          method: 'GET',
          url: `analytics/metrics?from=${from}&to=${to}&precision=${precision}`,
        })
        const filledMetrics = fillGapsInData(metrics, from, to, precision)
        setChartData(filledMetrics)
      }
      catch (error) {
        console.error('Error fetching metrics: ', error)
      }
      finally {
        setFetching(false)
      }
    }
    fetchMetrics()
  }, [range.from, range.to])

  const total = useMemo(
    () => ({
      pageviews: chartData.reduce((acc, curr) => acc + curr.pageviews, 0),
      visitors: chartData.reduce((acc, curr) => acc + curr.visitors, 0),
      bounces: chartData.reduce((acc, curr) => acc + curr.bounces, 0),
    }),
    [chartData],
  )

  if (fetching)
    return <Loader />

  if (!chartData || chartData.length === 0) {
    return (
      <Card className="py-0">
        <CardContent className="p-6">
          <div className="text-center">No data available</div>
        </CardContent>
      </Card>
    )
  }

  function cardHeader() {
    return (
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex w-full justify-between">
          <div className="flex">
            {['pageviews', 'visitors', 'bounces'].map((key) => {
              const chart = key as keyof typeof chartConfig
              return (
                <button
                  key={chart}
                  data-active={activeChart === chart}
                  className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                  onClick={() => setActiveChart(chart)}
                  type="button"
                >
                  <span className="text-s">{chartConfig[chart].label}</span>
                  <span className="text-lg leading-none font-bold sm:text-3xl">
                    {total[key as keyof typeof total].toLocaleString()}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </CardHeader>
    )
  }

  return (
    <Card className="py-0">
      {cardHeader()}
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)

                if (isNaN(date.getTime())) {
                  console.warn('Invalid date for tick:', value)
                  return String(value)
                }

                const hasTime = value.includes(':') || value.includes('T')

                if (hasTime) {
                  return date.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    hour12: true,
                  })
                }
                else {
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                }
              }}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              content={(
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    const date = new Date(value)
                    if (isNaN(date.getTime())) {
                      return value
                    }
                    return date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  }}
                />
              )}
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default Metrics
