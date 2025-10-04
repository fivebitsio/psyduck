import { Hono } from 'hono'
import type createConfigService from './service'
import type { UserRequest } from './types'
import { UserDoesNotExistError, UserExistsError } from './types'

interface deps {
  service: ReturnType<typeof createConfigService>
}

function createConfigHandler(deps: deps) {
  const app = new Hono()

  app.post('/users', async c => {
    try {
      const user = await c.req.json<UserRequest>()

      await deps.service.addUser(user)

      return c.json({}, 201)
    } catch (error) {
      switch (true) {
        case error instanceof UserExistsError:
          return c.json({ error: error.message }, 409)
        default:
          return c.json({ error: 'Internal server error' }, 500)
      }
    }
  })

  app.delete('/users/:email', async c => {
    try {
      const email = c.req.param('email')

      await deps.service.deleteUser(email)
      return c.json({}, 200)
    } catch (error) {
      switch (true) {
        case error instanceof UserDoesNotExistError:
          return c.json({ error: error.message }, 404)

        default:
          return c.json({ error: 'Internal server error' }, 500)
      }
    }
  })

  app.get('/users', async c => {
    try {
      const users = await deps.service.listEmails()
      return c.json(users, 200)
    } catch (error) {
      return c.json({ error: 'Internal server error' }, 500)
    }
  })

  return app
}

export default createConfigHandler
