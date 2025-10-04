export interface User {
  email: string
  password: string
}

export interface UserWithoutPassword {
  email: string
}

export interface ConfigSchema {
  users: User[]
  jwtKey: string
}

export interface UserRequest {
  email: string
  password: string
}

export class UserExistsError extends Error {
  constructor(email: string) {
    super(`Email '${email}' already exists`)
    this.name = 'UserExistsError'
  }
}

export class UserDoesNotExistError extends Error {
  constructor(email: string) {
    super(`Email '${email}' does not exist`)
    this.name = 'UserDoesNotExistError'
  }
}
