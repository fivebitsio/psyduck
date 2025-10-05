import { input, password } from '@inquirer/prompts'
import { JSONFilePreset } from 'lowdb/node'
import { resolve } from 'node:path'
import createConfigRepo from '../src/config/repo'
import createConfigService from '../src/config/service'
import type { ConfigSchema, User } from '../src/config/types'

const configPath = resolve(__dirname, '../data/config.json')

async function ensureJwtKey(configService: ReturnType<typeof createConfigService>) {
  try {
    if (await configService.jwtKeyExists()) {
      console.log('JWT key already exists.')
    } else {
      console.log('JWT key not found. Generating new JWT key...')
      await configService.generateJWTKey()
      console.log('JWT key generated and saved.')
    }
  } catch (error) {
    console.error('Error ensuring JWT key:', error)
    throw error
  }
}

async function ensureUserExists(configService: ReturnType<typeof createConfigService>) {
  try {
    const users = await configService.listEmails()

    if (!users || users.length === 0) {
      console.log('No users found. Please create an initial user.')

      const email = await input({
        message: 'Enter email:',
        validate: value => {
          if (!value || value.trim() === '') {
            return 'Email cannot be empty'
          }
          return true
        }
      })

      const userPassword = await password({
        message: 'Enter password:',
        validate: value => {
          if (!value || value.length < 6) {
            return 'Password must be at least 6 characters long'
          }
          return true
        }
      })
      const user: User = { email: email.trim(), password: userPassword }

      await configService.addUser(user)
      console.log(`User '${email}' created successfully.`)
    } else {
      console.log(
        `Found ${users.length} existing user(s): ${users.map(user => user.email).join(', ')}`
      )
    }
  } catch (error) {
    console.error('Error ensuring user exists:', error)
    throw error
  }
}

async function addUser(configService: ReturnType<typeof createConfigService>) {
  try {
    console.log('Adding a new user...')

    const email = await input({
      message: 'Enter email:',
      validate: value => {
        if (!value || value.trim() === '') {
          return 'Email cannot be empty'
        }
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value.trim())) {
          return 'Please enter a valid email address'
        }
        return true
      }
    })

    // Check if user already exists
    const existingUsers = await configService.listEmails()
    const userExists = existingUsers.some(
      user => user.email.toLowerCase() === email.trim().toLowerCase()
    )

    if (userExists) {
      console.log(`User with email '${email.trim()}' already exists.`)
      return
    }

    const userPassword = await password({
      message: 'Enter password:',
      validate: value => {
        if (!value || value.length < 6) {
          return 'Password must be at least 6 characters long'
        }
        return true
      }
    })

    const user: User = { email: email.trim(), password: userPassword }
    await configService.addUser(user)
    console.log(`User '${email.trim()}' created successfully.`)
  } catch (error) {
    console.error('Error adding user:', error)
    throw error
  }
}

async function main() {
  const args = process.argv.slice(2)

  try {
    const configDb = await JSONFilePreset(configPath, {
      jwtKey: '',
      users: [],
      demoMode: false
    } as ConfigSchema)
    const configRepo = createConfigRepo(configDb)
    const configService = createConfigService({ repo: configRepo })
    await ensureJwtKey(configService)

    // Check for --add-user flag
    if (args.includes('--add-user')) {
      await addUser(configService)
      return
    }

    await ensureUserExists(configService)
    console.log('Configuration setup completed successfully!')
  } catch (error) {
    console.error('Error during configuration setup:', error)
    process.exit(1)
  }
}

main()
