import { calendarRangeAtom } from '@/atoms/analytics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ChartConfig } from '@/components/ui/chart'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/lib/api'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'

const chartConfig = {
  count: {
    label: 'Visits',
    color: 'var(--chart-2)'
  },
  label: {
    color: 'var(--background)'
  }
} satisfies ChartConfig

export interface ChartData {
  countryCode: string
  countryName: string
  count: number
}

function Countries() {
  const [fetching, setFetching] = useState<boolean>(false)
  const [chartData, setChartData] = useState<ChartData[]>([])
  const range = useAtomValue(calendarRangeAtom)

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        setFetching(true)
        const from = range.from.toISOString()
        const to = range.to.toISOString()

        const metrics = await api<undefined, ChartData[]>({
          method: 'GET',
          url: `analytics/visits_by_country?from=${from}&to=${to}`
        })
        setChartData(metrics)
      } catch (error) {
        console.error('Error fetching metrics: ', error)
      } finally {
        setFetching(false)
      }
    }
    fetchVisits()
  }, [range.from, range.to])

  if (fetching)
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-1/3" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-1/4" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Countries</CardTitle>
        <CardDescription>Visits by country</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 48
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="countryName"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={value => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Bar dataKey="count" layout="vertical" fill="var(--color-count)" radius={4}>
              <LabelList
                dataKey="countryName"
                position="insideLeft"
                offset={8}
                className="fill-(--color-label)"
                fontSize={12}
              />
              <LabelList
                dataKey="count"
                position="right"
                offset={16}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default Countries
