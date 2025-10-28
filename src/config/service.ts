import type createConfigRepo from './repo'
import type { User, UserWithoutPassword } from './types'
import { UserDoesNotExistError, UserExistsError } from './types'

interface deps {
  repo: ReturnType<typeof createConfigRepo>
}

function createConfigService(deps: deps) {
  async function addUser(user: User): Promise<void> {
    const userExists = await deps.repo.userExistsByEmail(user.email)
    if (userExists) throw new UserExistsError(user.email)
    user.password = await Bun.password.hash(user.password)

    return deps.repo.addUser(user)
  }

  async function deleteUser(email: string): Promise<void> {
    const userExists = await deps.repo.userExistsByEmail(email)
    if (!userExists) throw new UserDoesNotExistError(email)

    return deps.repo.deleteUser(email)
  }

  async function listEmails(): Promise<UserWithoutPassword[]> {
    const users = await deps.repo.listUsers()

    return users.map(user => ({ email: user.email }))
  }

  async function generateJWTKey(): Promise<void> {
    const jwtSecret = await crypto.subtle.generateKey({ name: 'HMAC', hash: 'SHA-256' }, true, [
      'sign',
      'verify'
    ])

    const rawKey = await crypto.subtle.exportKey('raw', jwtSecret)

    const key = Buffer.from(new Uint8Array(rawKey)).toString('base64')
    await deps.repo.setJWTKey(key)
  }

  async function jwtKeyExists(): Promise<boolean> {
    const key = await deps.repo.getJwtKey()
    return key.length > 0
  }

  async function getDemoMode(): Promise<boolean> {
    return deps.repo.getDemoMode()
  }

  return {
    addUser,
    deleteUser,
    generateJWTKey,
    listEmails,
    jwtKeyExists,
    getDemoMode
  }
}

export default createConfigService
