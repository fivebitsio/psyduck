#!/usr/bin/env node

import process from 'node:process'
import { parseArgs } from 'node:util'
import Migrator from '../src/lib/migrator.js'

function showHelp() {
  console.log(`
Usage: migrate <command> [options]

Commands:
  up      Apply all pending migrations
  down    Rollback the last migration or a specified number of migrations

Options:
  --db <path>              Path to DuckDB database file (default: ./data/psyduck.db)
  --migrations <path>      Path to migrations directory (default: ./migrations)
  --number <n>            Number of migrations to rollback (down command only, default: 1)
                          Use "all" to rollback all migrations
  --help, -h              Show help

Examples:
  migrate up
  migrate up --db ./custom.db --migrations ./custom-migrations
  migrate down
  migrate down --number 3
  migrate down --number all
`)
}

function parseArguments() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      db: { type: 'string', default: './data/psyduck.db' },
      migrations: { type: 'string', default: './migrations' },
      number: { type: 'string', default: '1' },
      help: { type: 'boolean', short: 'h' },
    },
    allowPositionals: true,
    strict: false,
  })

  return { values, positionals }
}

async function handleUpCommand(migrator: Migrator) {
  try {
    await migrator.up()
    console.log('Migrations applied successfully')
  }
  catch (err) {
    if (err instanceof Error) {
      console.error('Error applying migrations:', err.message)
    }
    else {
      console.error('Error applying migrations:', err)
    }
    process.exit(1)
  }
}

async function handleDownCommand(
  migrator: Migrator,
  numberOfMigrations: string | boolean,
) {
  try {
    let num: number | 'all'
    if (numberOfMigrations === 'all') {
      num = 'all'
    }
    else {
      num = Number(numberOfMigrations)
      if (isNaN(num) || num < 1 || !Number.isInteger(num)) {
        console.error('Error: --number must be a positive integer or "all"')
        process.exit(1)
      }
    }

    await migrator.down(num)
    console.log('Migration(s) rolled back successfully')
  }
  catch (err) {
    if (err instanceof Error) {
      console.error('Error rolling back migration:', err.message)
    }
    else {
      console.error('Error rolling back migration:', err)
    }
    process.exit(1)
  }
}

async function main() {
  const { values, positionals } = parseArguments()

  if (values.help) {
    showHelp()
    process.exit(0)
  }

  const command = positionals[0]

  if (!command) {
    console.error('Error: You must provide a command (up, down)')
    showHelp()
    process.exit(1)
  }

  if (!['up', 'down'].includes(command)) {
    console.error(`Error: Unknown command "${command}". Use "up" or "down"`)
    showHelp()
    process.exit(1)
  }

  const migrator = new Migrator({
    dbPath: typeof values.db === 'string' ? values.db : './data/psyduck.db',
    migrationsDir:
      typeof values.migrations === 'string'
        ? values.migrations
        : './migrations',
  })

  try {
    if (command === 'up') {
      await handleUpCommand(migrator)
    }
    else if (command === 'down') {
      await handleDownCommand(migrator, values.number)
    }
  }
  finally {
    migrator.close()
  }
}

main().catch((error) => {
  console.error('Fatal error:', error.message)
  process.exit(1)
})
