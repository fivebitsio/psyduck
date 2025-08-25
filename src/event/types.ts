export type EventType = 'page-view'

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

export interface Event {
  browser: string
  countryCode: string
  deviceType: DeviceType
  eventID: string
  eventType: EventType
  hostname: string
  os: string
  pathname: string
  referrer: string
  uniqueVisit: boolean
  utmID: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  utmContent: string
  utmTerm: string
}

export interface CreateEvent {
  browser: string
  timezone: string
  deviceType: DeviceType
  eventID: string
  eventType: EventType
  hostname: string
  os: string
  pathname: string
  referrer: string
  utmID: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  utmContent: string
  utmTerm: string
}

export interface UpdateEvent {
  duration: number
}
