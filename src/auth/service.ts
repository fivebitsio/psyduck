import { sign, verify } from 'hono/jwt'
import type createConfigRepo from '../config/repo'
import type { SignInRequest } from './types'
import { InvalidCredentialsError } from './types'

interface deps {
  repo: ReturnType<typeof createConfigRepo>
}

function createAuthService(deps: deps) {
  async function signIn(req: SignInRequest): Promise<string> {
    const user = await deps.repo.getUserByEmail(req.email)

    if (user === undefined || !(await Bun.password.verify(req.password, user.password))) {
      throw new InvalidCredentialsError()
    }

    const payload = {
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      iss: 'psyduck.click',
      sub: user.email
    }

    const token = await sign(payload, 'JWT_SECRET')

    return token
  }

  async function verifyToken(token: string): Promise<boolean> {
    try {
      await verify(token, 'JWT_SECRET')
      return true
    } catch (error) {
      return false
    }
  }

  return {
    signIn,
    verifyToken
  }
}

export default createAuthService
