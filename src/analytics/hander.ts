import { Hono } from 'hono'
import type createAnalyticsService from './service'
import type { precision } from './types'

interface deps {
  service: ReturnType<typeof createAnalyticsService>
}

function createAnalyticsHandler(deps: deps) {
  const app = new Hono()

  app.get('/metrics', async c => {
    const { from, to, precision } = c.req.query()

    if (!from || !to || !precision) {
      return c.json(
        {
          success: false,
          error: 'Missing required query parameters: from, to, precision'
        },
        400
      )
    }

    try {
      // Validate precision value
      if (!['minute', 'hour', 'day', 'week', 'month'].includes(precision)) {
        return c.json({ success: false, error: 'Invalid precision value' }, 400)
      }

      const metrics = await deps.service.getMetrics(from, to, precision as precision)

      return c.json(metrics, 200)
    } catch (error) {
      console.error('Error fetching page views:', error)
      return c.json({ success: false, error: 'Failed to fetch page views' }, 500)
    }
  })

  app.get('/visits_by_country', async c => {
    try {
      const { from, to, all } = c.req.query()
      const allBool = all === 'true'

      const visits = await deps.service.getVisitsByCountry(from, to, allBool)

      return c.json(visits, 200)
    } catch (error) {
      console.error('Error fetching visits by country:', error)
      return c.json({ success: false, error: 'Failed to fetch visits by country' }, 500)
    }
  })

  app.get('/visits_by_device', async c => {
    try {
      const { from, to } = c.req.query()

      const visits = await deps.service.getVisitsByDevice(from, to)

      return c.json(visits, 200)
    } catch (error) {
      console.error('Error fetching visits by device:', error)
      return c.json({ success: false, error: 'Failed to fetch visits by device' }, 500)
    }
  })

  app.get('/visits_by_page', async c => {
    try {
      const { from, to } = c.req.query()

      const visits = await deps.service.getVisitsByPage(from, to)

      return c.json(visits, 200)
    } catch (error) {
      console.error('Error fetching visits by page:', error)
      return c.json({ success: false, error: 'Failed to fetch visits by page' }, 500)
    }
  })

  app.get('/visits_by_source', async c => {
    try {
      const { from, to } = c.req.query()

      const visits = await deps.service.getVisitsBySource(from, to)

      return c.json(visits, 200)
    } catch (error) {
      console.error('Error fetching visits by source:', error)
      return c.json({ success: false, error: 'Failed to fetch visits by page' }, 500)
    }
  })

  return app
}

export default createAnalyticsHandler
