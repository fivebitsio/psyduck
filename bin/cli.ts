#!/usr/bin/env node

import { select } from '@inquirer/prompts'
import { spawn } from 'child_process'

async function runCli() {
  const args = process.argv.slice(2)
  const command = args[0]

  if (!command || command === '--help' || command === '-h') {
    showHelp()
    process.exit(0)
  }

  switch (command) {
    case 'init':
      runInitCommand()
      break
    case 'migrate':
      runMigrateCommand()
      break
    case 'server':
      runServerCommand()
      break
    case 'interactive':
      runInteractiveMode()
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
  init        Initialize the configuration (runs bun bin/config.ts)
  migrate     Run database migrations (runs bun bin/migrate.ts)
  server      Start the psyduck server
  interactive Interactive mode to select command
  --help      Show this help message

Examples:
  psyduck init        Initialize configuration
  psyduck migrate     Run database migrations
  psyduck server      Start the server
  psyduck interactive Run interactive command selector
  psyduck --help      Show help
  `)
}

function runInitCommand() {
  console.log('Running initialization (bun bin/config.ts)...')
  const args = process.argv.slice(3)
  const child = spawn('bun', ['bin/config.ts', ...args], {
    stdio: 'inherit',
    cwd: process.cwd()
  })

  child.on('error', (err: Error) => {
    console.error('Failed to run init command:', err.message)
    process.exit(1)
  })

  child.on('exit', (code: number | null) => {
    process.exit(code || 0)
  })
}

function runMigrateCommand() {
  console.log('Running migrations (bun bin/migrate.ts)...')
  const args = process.argv.slice(3)
  const child = spawn('bun', ['bin/migrate.ts', ...args], {
    stdio: 'inherit',
    cwd: process.cwd()
  })

  child.on('error', (err: Error) => {
    console.error('Failed to run migrate command:', err.message)
    process.exit(1)
  })

  child.on('exit', (code: number | null) => {
    process.exit(code || 0)
  })
}

async function runInteractiveMode() {
  try {
    const choice = await select({
      message: 'Choose a command to run:',
      choices: [
        { name: 'Initialize configuration', value: 'init' },
        { name: 'Run migrations', value: 'migrate' },
        { name: 'Start server', value: 'server' },
        { name: 'Exit', value: 'exit' }
      ]
    })

    switch (choice) {
      case 'init':
        runInitCommand()
        break
      case 'migrate':
        runMigrateCommand()
        break
      case 'server':
        runServerCommand()
        break
      case 'exit':
        console.log('Exiting...')
        process.exit(0)
        break
      default:
        console.log('Invalid choice')
        process.exit(1)
    }
  } catch (error: any) {
    console.error('Interactive mode error:', error.message)
    process.exit(1)
  }
}

function runServerCommand() {
  console.log('Starting server...')
  import('../src/index.ts')
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
      process.exit(1)
    })
}

runCli()
