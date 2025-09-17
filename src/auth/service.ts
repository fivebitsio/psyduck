import type createConfigRepo from '../config/repo'
import type { SignInRequest } from './types'
import { password } from 'bun'
import { sign, verify } from 'hono/jwt'
import { InvalidCredentialsError } from './types'

interface deps {
  repo: ReturnType<typeof createConfigRepo>
}

function createAuthService(deps: deps) {
  async function signIn(req: SignInRequest): Promise<string> {
    const user = await deps.repo.getUserByUsername(req.username)

    if (user === undefined || !password.verify(req.password, user.password)) {
      throw InvalidCredentialsError
    }

    const payload = {
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      iss: 'psyduck.io',
      sub: user.username,
    }

    const token = await sign(payload, 'JWT_SECRET')

    return token
  }

  async function verifyToken(token: string): Promise<boolean> {
    try {
      await verify(token, 'JWT_SECRET')
      return true
    }
    catch (error) {
      return false
    }
  }

  return {
    signIn,
    verifyToken,
  }
}

export default createAuthService
