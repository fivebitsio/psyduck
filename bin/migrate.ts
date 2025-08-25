#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import Migrator from '../src/lib/migrator'
import process from 'node:process'

yargs(hideBin(process.argv))
  .command('up', 'Apply all pending migrations', {}, async (argv) => {
    const migrator = new Migrator({
      dbPath: String(argv.db),
      migrationsDir: String(argv.migrations),
    })
    try {
      await migrator.up()
      console.log('Migrations applied successfully')
    } catch (err: unknown) {
      console.error('Error applying migrations:', (err as Error).message)
      process.exit(1)
    } finally {
      migrator.close()
    }
  })
  .command(
    'down',
    'Rollback the last migration or a specified number of migrations',
    {
      numberOfMigrations: {
        type: 'number',
        description:
          'Number of migrations to rollback (use "all" to rollback all)',
        default: '1',
      },
    },
    async (argv) => {
      const migrator = new Migrator({
        dbPath: String(argv.db),
        migrationsDir: String(argv.migrations),
      })
      try {
        let num: number | 'all'
        if (argv.numberOfMigrations === 'all') {
          num = 'all'
        } else {
          num = Number(argv.numberOfMigrations)
        }
        await migrator.down(num)
        console.log('Migration(s) rolled back successfully')
      } catch (err: unknown) {
        console.error('Error rolling back migration:', (err as Error).message)
        process.exit(1)
      } finally {
        migrator.close()
      }
    },
  )
  .option('db', {
    type: 'string',
    description: 'Path to DuckDB database file',
    default: './data/psyduck.db',
  })
  .option('migrations', {
    type: 'string',
    description: 'Path to migrations directory',
    default: './migrations',
  })
  .demandCommand(1, 'You must provide a command (up, down)')
  .help()
  .strict()
  .fail((msg, err, yargs) => {
    if (err) throw err
    console.error(msg)
    yargs.showHelp()
    process.exit(1)
  })
  .parse()
