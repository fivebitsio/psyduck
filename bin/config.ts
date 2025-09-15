import { input, password } from '@inquirer/prompts'
import { resolve } from 'path'
import { JSONFilePreset } from 'lowdb/node'
import { ConfigSchema, User } from '../src/config/types'
import createConfigRepo from '../src/config/repo'
import createConfigService from '../src/config/service'

const configPath = resolve(__dirname, '../data/config.json')

async function ensureJwtKey(
  configService: ReturnType<typeof createConfigService>,
) {
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

async function ensureUserExists(
  configService: ReturnType<typeof createConfigService>,
) {
  try {
    const users = await configService.listUserNames()

    if (!users || users.length === 0) {
      console.log('No users found. Please create an initial user.')

      const username = await input({
        message: 'Enter username:',
        validate: (value) => {
          if (!value || value.trim() === '') {
            return 'Username cannot be empty'
          }
          return true
        },
      })

      const userPassword = await password({
        message: 'Enter password:',
        validate: (value) => {
          if (!value || value.length < 6) {
            return 'Password must be at least 6 characters long'
          }
          return true
        },
      })
      const user: User = { username: username.trim(), password: userPassword }

      await configService.addUser(user)
      console.log(`User '${username}' created successfully.`)
    } else {
      console.log(
        `Found ${users.length} existing user(s): ${users.map((user) => user.username).join(', ')}`,
      )
    }
  } catch (error) {
    console.error('Error ensuring user exists:', error)
    throw error
  }
}

async function initializeConfig() {
  try {
    const configDb = await JSONFilePreset(configPath, {
      jwtKey: '',
      users: [],
    } as ConfigSchema)
    const configRepo = createConfigRepo(configDb)
    const configService = createConfigService({ repo: configRepo })

    await ensureJwtKey(configService)

    await ensureUserExists(configService)

    console.log('Configuration setup completed successfully!')

    return configService
  } catch (error) {
    console.error('Error during configuration setup:', error)
    process.exit(1)
  }
}

initializeConfig()
