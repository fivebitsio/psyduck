import { Low } from 'lowdb'
import { ConfigSchema, User } from './types'

function createConfigRepo(db: Low<ConfigSchema>) {
  async function addUser(user: User): Promise<void> {
    await db.update(({ users }) => users.push(user))
  }

  async function deleteUser(username: string): Promise<void> {
    await db.update(({ users }) => users.filter((u) => u.username != username))
  }

  return {
    addUser,
    deleteUser,
  }
}

export default createConfigRepo
