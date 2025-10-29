import { calendarRangeAtom } from '@/atoms/analytics'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import api from '@/lib/api'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import Browsers from './devices/browsers'
import DeviceTypes from './devices/device_types'
import Os from './devices/os'

export interface VisitsByDeviceType {
  deviceType: string
  count: number
}

export interface VisitsByBrowser {
  browser: string
  count: number
}

export interface VisitsByOs {
  os: string
  count: number
}

export interface ChartData {
  deviceTypes: VisitsByDeviceType[]
  browsers: VisitsByBrowser[]
  os: VisitsByOs[]
}

function Devices() {
  const [fetching, setFetching] = useState<boolean>(false)
  const [chartData, setChartData] = useState<ChartData>({
    deviceTypes: [],
    browsers: [],
    os: []
  })
  const range = useAtomValue(calendarRangeAtom)

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        setFetching(true)
        const from = range.from.toISOString()
        const to = range.to.toISOString()

        const metrics = await api<undefined, ChartData>({
          method: 'GET',
          url: `api/analytics/visits_by_device?from=${from}&to=${to}`
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
      <div>
        <div className="flex space-x-2 mb-4">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )

  return (
    <Tabs defaultValue="devices">
      <TabsList>
        <TabsTrigger value="devices">Device</TabsTrigger>
        <TabsTrigger value="browsers">Browser</TabsTrigger>
        <TabsTrigger value="os">Os</TabsTrigger>
      </TabsList>
      <TabsContent value="devices">
        <DeviceTypes deviceTypes={chartData.deviceTypes} />
      </TabsContent>
      <TabsContent value="browsers">
        <Browsers browsers={chartData.browsers} />
      </TabsContent>
      <TabsContent value="os">
        <Os os={chartData.os} />
      </TabsContent>
    </Tabs>
  )
}

export default Devices
