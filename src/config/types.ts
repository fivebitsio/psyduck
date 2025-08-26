export interface User {
  username: string
  password: string
}

export interface ConfigSchema {
  users: User[]
}

export interface UserRequest {
  username: string
  password: string
}
