import { DuckDBInstance } from '@duckdb/node-api'
import { serve } from '@hono/node-server'
import dotenv from 'dotenv'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'
import { logger } from 'hono/logger'
import type { ConfigSchema } from './config/types'

dotenv.config()

import { JSONFilePreset } from 'lowdb/node'
import createAnalyticsHandler from './analytics/handler'
import createAnalyticsRepo from './analytics/repo'
import createAnalyticsService from './analytics/service'
import createAuthHandler from './auth/handler'
import createAuthService from './auth/service'
import createConfigHandler from './config/handler'
import createConfigRepo from './config/repo'
import createConfigService from './config/service'
import createEventHandler from './event/handler'
import createEventRepo from './event/repo'
import createEventService from './event/service'

const app = new Hono()

app.use(logger())

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(origin => origin.trim()) || ['https://psyduck.click']

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['X-Requested-With', 'Content-Type', 'Authorization'],
    maxAge: 86400
  })
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

const authService = createAuthService({ repo: configRepo })
const authHandler = createAuthHandler({ service: authService })

const jwtKey = await configRepo.getJwtKey()

const jwtMiddleware = jwt({
  secret: jwtKey,
  alg: 'HS256'
})

configHandler.use('*', jwtMiddleware)

const demoMode = await configService.getDemoMode()

if (demoMode === false) {
  analyticsHandler.use('*', jwtMiddleware)
}

app.get('/health', c => {
  return c.json({ status: 'ok' })
})

app.route('/analytics', analyticsHandler)
app.route('/config', configHandler)
app.route('/events', eventHandler)
app.route('/auth', authHandler)

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

const port = parseInt(process.env.PORT || '9876')

serve({
  fetch: app.fetch,
  port: port,
})
