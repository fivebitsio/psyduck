const pageViews = `
    select
      count(*) as count,
      date_trunc($precision, timestamp) as time
    from events
    where event_type = 'page-view'
      and timestamp >= $from
      and timestamp <= $to
    group by time
    order by time
  `

const visits = `
    select
      count(*) as count,
      date_trunc($precision, timestamp) as time
    from events
      where event_type = 'page-view'
      and unique_visit = true
      and timestamp >= $from
      and timestamp <= $to
    group by time
    order by time
  `

const visitsByCountry = `
    select
      count(*) as count,
      country_code
    from events
      where event_type = 'page-view'
      and unique_visit = true
      and timestamp >= $from
      and timestamp <= $to
    group by country_code
    order by count desc
    limit $limit
  `

const visitsByDeviceType = `
    select
      count(*) as count,
      device_type as deviceType
    from events
      where event_type = 'page-view'
      and unique_visit = true
      and timestamp >= $from
      and timestamp <= $to
    group by deviceType
  `
const visitsByBrowser = `
    select
      count(*) as count,
      browser
    from events
      where event_type = 'page-view'
      and unique_visit = true
      and timestamp >= $from
      and timestamp <= $to
    group by browser
    order by count desc
`

const visitsByOs = `
    select
      count(*) as count,
      os
    from events
      where event_type = 'page-view'
      and unique_visit = true
      and timestamp >= $from
      and timestamp <= $to
    group by os
    order by count desc
`

const visitsByPage = `
    select
      count(*) as count,
      pathname
    from events
      where event_type = 'page-view'
      and timestamp >= $from
      and timestamp <= $to
    group by pathname
    order by count desc
    limit $limit
`

const visitsBySource = `
    select
      count(*) as count,
      referrer
    from events
      where event_type = 'page-view'
      and timestamp >= $from
      and timestamp <= $to
    group by referrer
    order by count desc
`

export {
  pageViews,
  visits,
  visitsByBrowser,
  visitsByCountry,
  visitsByDeviceType,
  visitsByOs,
  visitsByPage,
  visitsBySource
}
