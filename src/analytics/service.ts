import type createAnalyticsRepo from './repo'
import type {
  Metric,
  MetricsResponse,
  precision,
  VisitsByCountry,
  VisitsByDevice,
  VisitsByPage,
  VisitsBySource,
} from './types'

interface deps {
  repo: ReturnType<typeof createAnalyticsRepo>
}

function createAnalyticsService(deps: deps) {
  async function getMetrics(
    from: string,
    to: string,
    precision: precision,
  ): Promise<MetricsResponse[]> {
    const [pageViews, visits] = await Promise.all([
      deps.repo.getPageViews(from, to, precision),
      deps.repo.getVisits(from, to, precision),
    ])

    const metricsMap = new Map<string, MetricsResponse>()

    pageViews.forEach((metric: Metric) => {
      if (!metricsMap.has(metric.time)) {
        metricsMap.set(metric.time, {
          date: metric.time,
          pageviews: 0,
          visitors: 0,
          bounces: 0,
        })
      }
      metricsMap.get(metric.time)!.pageviews = metric.count
    })

    visits.forEach((metric: Metric) => {
      if (!metricsMap.has(metric.time)) {
        metricsMap.set(metric.time, {
          date: metric.time,
          pageviews: 0,
          visitors: 0,
          bounces: 0,
        })
      }
      metricsMap.get(metric.time)!.visitors = metric.count
    })

    return Array.from(metricsMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date),
    )
  }

  async function getVisitsByCountry(
    from: string,
    to: string,
    all: boolean = false,
  ): Promise<VisitsByCountry[]> {
    const limit = all ? 1000 : 10
    return await deps.repo.getVisitsByCountry(from, to, limit)
  }

  async function getVisitsByDevice(
    from: string,
    to: string,
  ): Promise<VisitsByDevice> {
    const [deviceTypes, browsers, os] = await Promise.all([
      deps.repo.getVisitsByDeviceType(from, to),
      deps.repo.getVisitsByBrowser(from, to),
      deps.repo.getVisitsByOs(from, to),
    ])

    return { deviceTypes, browsers, os }
  }

  async function getVisitsByPage(
    from: string,
    to: string,
  ): Promise<VisitsByPage[]> {
    return await deps.repo.getVisitsByPage(from, to)
  }

  async function getVisitsBySource(
    from: string,
    to: string,
  ): Promise<VisitsBySource[]> {
    return await deps.repo.getVisitsBySource(from, to)
  }

  return {
    getMetrics,
    getVisitsByCountry,
    getVisitsByDevice,
    getVisitsByPage,
    getVisitsBySource,
  }
}

export default createAnalyticsService
