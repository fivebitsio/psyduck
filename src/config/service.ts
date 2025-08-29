import createConfigRepo from './repo'
import {
  User,
  UserDoesNotExistError,
  UserExistsError,
  UserWithoutPassword,
} from './types'

interface deps {
  repo: ReturnType<typeof createConfigRepo>
}

function createConfigService(deps: deps) {
  async function addUser(user: User): Promise<void> {
    const userExists = await deps.repo.existsByUsername(user.username)
    if (userExists) throw new UserExistsError(user.username)

    return deps.repo.addUser(user)
  }

  async function deleteUser(username: string): Promise<void> {
    const userExists = await deps.repo.existsByUsername(username)
    if (!userExists) throw new UserDoesNotExistError(username)

    return deps.repo.deleteUser(username)
  }

  async function listUserNames(): Promise<UserWithoutPassword[]> {
    const users = await deps.repo.listUsers()

    return users.map((user) => ({ username: user.username }))
  }

  return {
    addUser,
    deleteUser,
    listUserNames,
  }
}

export default createConfigService
