export interface Metric {
  time: string
  count: number
}

export interface VisitsByCountry {
  countryCode: string
  countryName: string
  count: number
}

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

export interface VisitsByDevice {
  deviceTypes: VisitsByDeviceType[]
  browsers: VisitsByBrowser[]
  os: VisitsByOs[]
}

export interface VisitsByPage {
  pathname: string
  count: number
}

export interface VisitsBySource {
  source: string
  count: number
}

export interface MetricsResponse {
  date: string
  pageviews: number
  visitors: number
  bounces: number
}

export type precision = 'minute' | 'hour' | 'day' | 'week' | 'month'
