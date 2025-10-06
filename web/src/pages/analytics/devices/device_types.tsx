import { Card, CardContent } from '@/components/ui/card'
import type { ChartConfig } from '@/components/ui/chart'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { useMemo } from 'react'
import { Label, Pie, PieChart } from 'recharts'
import type { VisitsByDeviceType } from '../devices'

const chartConfig = {
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-1)'
  },
  tablet: {
    label: 'Tablet',
    color: 'var(--chart-2)'
  },
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-3)'
  }
} satisfies ChartConfig

interface DeviceTypesProps {
  deviceTypes: VisitsByDeviceType[]
}

function DeviceTypes({ deviceTypes }: DeviceTypesProps) {
  const deviceTypesWithFill = useMemo(() => {
    return deviceTypes.map(item => ({
      ...item,
      fill: `var(--color-${item.deviceType})`
    }))
  }, [deviceTypes])

  const totalVisitors = useMemo(() => {
    return deviceTypes.reduce((acc, curr) => acc + curr.count, 0)
  }, [deviceTypes])

  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={deviceTypesWithFill}
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
