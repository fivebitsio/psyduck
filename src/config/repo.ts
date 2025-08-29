import { Low } from 'lowdb'
import { ConfigSchema, User } from './types'

function createConfigRepo(db: Low<ConfigSchema>) {
  async function addUser(user: User): Promise<void> {
    return db.update(({ users }) => users.push(user))
  }

  async function deleteUser(username: string): Promise<void> {
    return db.update((data) => {
      data.users = data.users.filter((u) => u.username !== username)
    })
  }

  async function existsByUsername(username: string): Promise<boolean> {
    return db.data.users.some((u) => u.username === username)
  }

  async function listUsers(): Promise<User[]> {
    return db.data.users
  }

  return {
    addUser,
    deleteUser,
    existsByUsername,
    listUsers,
  }
}

export default createConfigRepo
