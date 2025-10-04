import type { Low } from 'lowdb'
import type { ConfigSchema, User } from './types'

function createConfigRepo(db: Low<ConfigSchema>) {
  async function addUser(user: User): Promise<void> {
    return db.update(({ users }) => users.push(user))
  }

  async function deleteUser(email: string): Promise<void> {
    return db.update((data) => {
      data.users = data.users.filter(u => u.email !== email)
    })
  }

  async function userExistsByEmail(email: string): Promise<boolean> {
    return db.data.users.some(u => u.email === email)
  }

  async function getUserByEmail(
    email: string,
  ): Promise<User | undefined> {
    return db.data.users.find(u => u.email === email)
  }

  async function listUsers(): Promise<User[]> {
    return db.data.users
  }

  async function setJWTKey(key: string): Promise<void> {
    return db.update((data) => {
      data.jwtKey = key
    })
  }

  async function getJwtKey(): Promise<string> {
    return db.data.jwtKey
  }

  return {
    addUser,
    deleteUser,
    userExistsByEmail,
    getUserByEmail,
    listUsers,
    setJWTKey,
    getJwtKey,
  }
}

export default createConfigRepo
