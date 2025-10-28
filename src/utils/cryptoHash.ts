import { randomBytes, scrypt } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt)


export async function hashPassword(password: string, saltLength: number = 32): Promise<string> {
  const salt = randomBytes(saltLength).toString('hex')
  
  const derivedKey = await scryptAsync(password, salt, 64) as Buffer
  
  return `${salt}:${derivedKey.toString('hex')}`
}

/**
 * Compare a plain text password with a hashed password
 * @param password Plain text password
 * @param hashedPassword The stored hash in format "salt:hashedPassword"
 * @returns true if the password matches, false otherwise
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  const [salt, storedHash] = hashedPassword.split(':')
  
  if (!salt || !storedHash) {
    throw new Error('Invalid hashed password format')
  }
  
  // Hash the provided password with the same salt
  const derivedKey = await scryptAsync(password, salt, 64) as Buffer
  const computedHash = derivedKey.toString('hex')
  
  // Compare the computed hash with the stored hash
  return computedHash === storedHash
}