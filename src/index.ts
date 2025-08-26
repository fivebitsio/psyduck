import { DuckDBInstance } from '@duckdb/node-api'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { JSONFilePreset } from 'lowdb/node'

import createAnalyticsHandler from './analytics/hander'
import createAnalyticsRepo from './analytics/repo'
import createAnalyticsService from './analytics/service'

import createConfigHandler from './config/handler'
import createConfigRepo from './config/repo'
import createConfigService from './config/service'
import type { ConfigSchema } from './config/types'

import createEventHandler from './event/handler'
import createEventRepo from './event/repo'
import createEventService from './event/service'

const app = new Hono()

app.use(logger())
app.use(
  cors({
    origin: '*',
  }),
)

const instance = await DuckDBInstance.create('data/psyduck.db')
const configDb = await JSONFilePreset('data/config.json', {} as ConfigSchema)
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

const analyticsRepo = createAnalyticsRepo(db)
const analyticsService = createAnalyticsService({ repo: analyticsRepo })
const analyticsHandler = createAnalyticsHandler({ service: analyticsService })

const configRepo = createConfigRepo(configDb)
const configService = createConfigService({ repo: configRepo })
const configHandler = createConfigHandler({ service: configService })

const eventRepo = createEventRepo(db)
const eventService = createEventService({ repo: eventRepo })
const eventHandler = createEventHandler({ service: eventService })

app.get('/health', (c) => {
  return c.json({ status: 'ok' })
})

app.route('/analytics', analyticsHandler)
app.route('/config', configHandler)
app.route('/events', eventHandler)

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
