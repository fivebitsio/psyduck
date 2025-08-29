import { Hono } from 'hono'
import createAuthService from './service'
import { InvalidCredentialsError, SignInRequest } from './types'

interface deps {
  service: ReturnType<typeof createAuthService>
}

function createAuthHandler(deps: deps) {
  const app = new Hono()

  app.post('/signIn', async (c) => {
    try {
      const user = await c.req.json<SignInRequest>()
      const token = await deps.service.signIn(user)

      return c.json({ token }, 201)
    } catch (error) {
      switch (true) {
        case error instanceof InvalidCredentialsError:
          return c.json({ error: error.message }, 401)
        default:
          return c.json({ error: 'Internal server error' }, 500)
      }
    }
  })

  return app
}

export default createAuthHandler
