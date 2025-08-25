import { Hono } from 'hono'
import { CreateEvent, UpdateEvent } from './types'
import EventService from './service'
import createEventService from './service'

interface deps {
  service: ReturnType<typeof createEventService>
}

function createEventHandler(deps: deps) {
  const app = new Hono()

  app.post('/', async (c) => {
    try {
      const createEvent = await c.req.json<CreateEvent>()

      await deps.service.createEvent(createEvent)

      return c.json({}, 201)
    } catch (error) {
      console.error('Error creating event:', error)
      return c.json({}, 500)
    }
  })

  app.post('/:eventId', async (c) => {
    try {
      const eventId = c.req.param('eventId')
      const updateEvent = await c.req.json<UpdateEvent>()

      await deps.service.updateEvent(eventId, updateEvent)
      return c.json({}, 200)
    } catch (error) {
      console.error('Error updating event:', error)
      return c.json({}, 500)
    }
  })

  return app
}

export default createEventHandler
