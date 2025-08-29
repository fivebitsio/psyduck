import { Card, CardContent } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { useMemo } from 'react'
import { Label, Pie, PieChart } from 'recharts'
import type { VisitsByDeviceType } from '../devices'

const chartConfig = {
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-1)',
  },
  tablet: {
    label: 'Tablet',
    color: 'var(--chart-2)',
  },
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig

interface DeviceTypesProps {
  deviceTypes: VisitsByDeviceType[]
}

function DeviceTypes({ deviceTypes }: DeviceTypesProps) {
  const totalVisitors = useMemo(() => {
    return deviceTypes.reduce((acc, curr) => acc + curr.count, 0)
  }, [])

  console.log(deviceTypes)

  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={deviceTypes}
              dataKey="count"
              nameKey="deviceType"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default DeviceTypes
