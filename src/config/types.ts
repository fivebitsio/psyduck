export interface User {
  username: string
  password: string
}

export interface UserWithoutPassword {
  username: string
}

export interface ConfigSchema {
  users: User[]
  jwtKey: string
}

export interface UserRequest {
  username: string
  password: string
}

export class UserExistsError extends Error {
  constructor(username: string) {
    super(`Username '${username}' already exists`)
    this.name = 'UserExistsError'
  }
}

export class UserDoesNotExistError extends Error {
  constructor(username: string) {
    super(`Username '${username}' does not exist`)
    this.name = 'UserDoesNotExistError'
  }
}
