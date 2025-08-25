import { DuckDBInstance } from '@duckdb/node-api'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import createAnalyticsRepo from './analytics/repo'
import createAnalyticsService from './analytics/service'
import createAnalyticsHandler from './analytics/hander'
import createEventRepo from './event/repo'
import createEventService from './event/service'
import createEventHandler from './event/handler'

const app = new Hono()

app.use(logger())
app.use(
  cors({
    origin: '*',
  }),
)

const instance = await DuckDBInstance.create('data/psyduck.db')
const db = await instance.connect()

async function closeDb() {
  if (db) {
    db.closeSync()
    console.log('Database connection closed')
  }
  if (instance) {
    instance.closeSync()
    console.log('DuckDB instance closed')
  }
}

const eventRepo = createEventRepo(db)
const eventService = createEventService({ repo: eventRepo })
const eventHandler = createEventHandler({ service: eventService })

const analyticsRepo = createAnalyticsRepo(db)
const analyticsService = createAnalyticsService({ repo: analyticsRepo })
const analyticsHandler = createAnalyticsHandler({ service: analyticsService })

app.get('/health', (c) => {
  return c.json({ status: 'ok' })
})

app.route('/events', eventHandler)
app.route('/analytics', analyticsHandler)

process.on('SIGINT', async () => {
  console.log('Received SIGINT. Closing database connection...')
  await closeDb()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM. Closing database connection...')
  await closeDb()
  process.exit(0)
})

export default {
  port: 1323,
  fetch: app.fetch,
}
