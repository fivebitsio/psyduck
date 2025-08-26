import createConfigRepo from './repo'
import { User } from './types'

interface deps {
  repo: ReturnType<typeof createConfigRepo>
}

function createConfigService(deps: deps) {
  async function addUser(user: User): Promise<void> {
    return deps.repo.addUser(user)
  }

  async function deleteUser(username: string): Promise<void> {
    return deps.repo.deleteUser(username)
  }

  return {
    addUser,
    deleteUser,
  }
}

export default createConfigService
