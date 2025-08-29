import * as ct from 'countries-and-timezones'

import { getHostname } from '../utils'
import createEventRepo from './repo'
import { CreateEvent, Event, UpdateEvent } from './types'

interface deps {
  repo: ReturnType<typeof createEventRepo>
}

function createEventService(deps: deps) {
  async function createEvent(cEvent: CreateEvent): Promise<void> {
    const { timezone, ...eventWithoutTimezone } = cEvent
    const uniqueVisit = cEvent.hostname != getHostname(cEvent.referrer)
    const event: Event = {
      ...eventWithoutTimezone,
      countryCode: ct.getCountryForTimezone(timezone)?.id || 'unknown',
      uniqueVisit: uniqueVisit,
    }

    return await deps.repo.create(event)
  }

  async function updateEvent(
    eventId: string,
    uEvent: UpdateEvent,
  ): Promise<void> {
    return await deps.repo.updateDuration(eventId, uEvent.duration)
  }

  return {
    createEvent,
    updateEvent,
  }
}

export default createEventService
