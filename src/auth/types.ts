export interface SignInRequest {
  username: string
  password: string
}

export interface SignInResponse {
  token: string
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid username / password')
    this.name = 'InvalidCredentialsError'
  }
}
