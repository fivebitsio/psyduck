#!/usr/bin/env node

import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function runCli() {
  const args = process.argv.slice(2)
  const command = args[0]

  if (!command || command === '--help' || command === '-h') {
    showHelp()
    process.exit(0)
  }

  switch (command) {
    case 'init':
      await runInitCommand()
      break
    case 'migrate':
      await runMigrateCommand()
      break
    case 'server':
      runServerCommand()
      break
    default:
      console.log(`Unknown command: ${command}`)
      showHelp()
      process.exit(1)
  }
}

function showHelp() {
  console.log(`
Usage: psyduck [command]

Commands:
  init        Initialize the configuration
  migrate     Run database migrations
  server      Start the psyduck server
  --help      Show this help message

Examples:
  psyduck init        Initialize configuration
  psyduck migrate     Run database migrations
  psyduck server      Start the server
  psyduck --help      Show help
  `)
}

async function runInitCommand() {
  console.log('Running initialization...')
  const args = process.argv.slice(3)

  const originalArgv = process.argv
  process.argv = ['bun', 'config.ts', ...args]

  try {
    await import('./config.ts')
  } catch (err: unknown) {
    console.error(
      'Failed to run init command:',
      err instanceof Error ? err.message : 'Unknown error'
    )
    process.exit(1)
  } finally {
    process.argv = originalArgv
  }
}

async function runMigrateCommand() {
  console.log('Running migrations...')
  const args = process.argv.slice(3)

  const originalArgv = process.argv
  process.argv = ['bun', 'migrate.ts', ...args]

  try {
    await import('./migrate.ts')
  } catch (err: unknown) {
    console.error(
      'Failed to run migrate command:',
      err instanceof Error ? err.message : 'Unknown error'
    )
    process.exit(1)
  } finally {
    process.argv = originalArgv
  }
}

function runServerCommand() {
  console.log('Starting server...')
  const projectRoot = dirname(__dirname)
  const originalCwd = process.cwd()
  process.chdir(projectRoot)

  const srcPath = join(projectRoot, 'src', 'index.ts')
  import(srcPath)
    .then(module => {
      const { serve } = require('@hono/node-server')
      serve(
        {
          ...module.default
        },
        (info: { port: number }) => {
          console.log(`psyduck server running on port ${info.port}`)
        }
      )
    })
    .catch((err: Error) => {
      console.error('Failed to start server:', err.message)
      process.chdir(originalCwd)
      process.exit(1)
    })
}

runCli()
