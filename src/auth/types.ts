export interface SignInRequest {
  email: string
  password: string
}

export interface SignInResponse {
  token: string
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid email / password')
    this.name = 'InvalidCredentialsError'
  }
}
