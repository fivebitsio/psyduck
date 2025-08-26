import { Hono } from 'hono'
import createConfigService from './service'
import { UserRequest } from './types'

interface deps {
  service: ReturnType<typeof createConfigService>
}

function createConfigHandler(deps: deps) {
  const app = new Hono()

  app.post('/users', async (c) => {
    try {
      const user = await c.req.json<UserRequest>()

      await deps.service.addUser(user)

      return c.json({}, 201)
    } catch (error) {
      console.error('Error creating user:', error)
      return c.json({}, 500)
    }
  })

  app.delete('/users/:username', async (c) => {
    try {
      const username = c.req.param('username')

      await deps.service.deleteUser(username)
      return c.json({}, 200)
    } catch (error) {
      console.error('Error deleting user:', error)
      return c.json({}, 500)
    }
  })

  return app
}

export default createConfigHandler
