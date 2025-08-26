import { Low } from 'lowdb'
import { ConfigSchema, User } from './types'

/*
  Lowdb doesn't support concurrency.
  Concurrent writes will corrupt the data,
  Since changing config is an admin thing
  and only done as a rare maintenance work,
  this is fine
*/

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
