import type { DuckDBConnection } from '@duckdb/node-api'
import type { Event } from './types.js'

function createEventRepo(duckdb: DuckDBConnection) {
  const updateDurationQuery = `
    update events 
      set duration = $duration 
    where event_id = $eventID;
  `

  const insertQuery = `INSERT INTO events (
      browser,
      country_code,
      device_type,
      event_id,
      event_type,
      hostname,
      os,
      pathname,
      referrer,
      unique_visit,
      utm_id,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term
    ) VALUES (
      $browser,
      $countryCode,
      $deviceType,
      $eventID,
      $eventType,
      $hostname,
      $os,
      $pathname,
      $referrer,
      $uniqueVisit,
      $utmID,
      $utmSource,
      $utmMedium,
      $utmCampaign,
      $utmContent,
      $utmTerm
    );`

  async function create(event: Event): Promise<void> {
    await duckdb.run(insertQuery, { ...event })
  }

  async function updateDuration(
    eventID: string,
    duration: number,
  ): Promise<void> {
    await duckdb.run(updateDurationQuery, { eventID, duration })
  }

  return {
    create,
    updateDuration,
  }
}

export default createEventRepo
