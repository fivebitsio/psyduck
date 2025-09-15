import { password } from 'bun'
import type createConfigRepo from './repo'
import {
  type User,
  UserDoesNotExistError,
  UserExistsError,
  type UserWithoutPassword,
} from './types'

interface deps {
  repo: ReturnType<typeof createConfigRepo>
}

function createConfigService(deps: deps) {
  async function addUser(user: User): Promise<void> {
    const userExists = await deps.repo.userExistsByUsername(user.username)
    if (userExists) throw new UserExistsError(user.username)
    user.password = password.hashSync(user.password)

    return deps.repo.addUser(user)
  }

  async function deleteUser(username: string): Promise<void> {
    const userExists = await deps.repo.userExistsByUsername(username)
    if (!userExists) throw new UserDoesNotExistError(username)

    return deps.repo.deleteUser(username)
  }

  async function listUserNames(): Promise<UserWithoutPassword[]> {
    const users = await deps.repo.listUsers()

    return users.map((user) => ({ username: user.username }))
  }

  async function generateJWTKey(): Promise<void> {
    const jwtSecret = await crypto.subtle.generateKey(
      { name: 'HMAC', hash: 'SHA-256' },
      true,
      ['sign', 'verify'],
    )

    const rawKey = await crypto.subtle.exportKey('raw', jwtSecret)
    const key = Buffer.from(new Uint8Array(rawKey)).toString('base64')
    await deps.repo.setJWTKey(key)
  }

  async function jwtKeyExists(): Promise<boolean> {
    const key = await deps.repo.getJwtKey()
    console.log('JWT Key:', key.length > 0)
    return key.length > 0
  }

  return {
    addUser,
    deleteUser,
    generateJWTKey,
    listUserNames,
    jwtKeyExists,
  }
}

export default createConfigService
