import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { type DuckDBConnection, DuckDBInstance } from '@duckdb/node-api'

interface MigratorConfig {
  dbPath: string
  migrationsDir: string
}

class Migrator {
  private dbPath: string
  private db!: DuckDBConnection
  private migrationsDir: string
  private appliedMigrationsQuery =
    'select name from schema_migrations order by name'
  private deleteMigrationQuery = 'delete from schema_migrations where name = $1'
  private insertMigrationQuery =
    'insert into schema_migrations (name, applied_at) values ($1, $2)'
  private createSchemaMigrationsQuery = `create table if not exists
    schema_migrations ( name varchar primary key, applied_at timestamp not null)`

  constructor({ dbPath, migrationsDir }: MigratorConfig) {
    this.dbPath = dbPath
    this.migrationsDir = migrationsDir
  }

  async init(): Promise<void> {
    const instance = await DuckDBInstance.create(this.dbPath)
    this.db = await instance.connect()

    await this.executeQuery(this.createSchemaMigrationsQuery)
  }

  close(): void {
    this.db.closeSync()
  }

  async up(): Promise<void> {
    await this.init()

    const migrations = await this.getPendingMigrations()

    for (const migration of migrations) {
      const query = await fs.readFile(
        path.join(this.migrationsDir, `${migration}.up.sql`),
        'utf8',
      )
      await this.executeQuery(query)
      await this.executeQuery(this.insertMigrationQuery, [
        migration,
        new Date().toISOString(),
      ])
      console.log(`Applied: ${migration}`)
    }
  }

  async down(numberOfMigrations: number | 'all'): Promise<void> {
    await this.init()

    const appliedMigrations = await this.getAppliedMigrations()
    if (appliedMigrations.length === 0) {
      console.log('No migrations to roll back')
      return
    }

    let migrationsToRollback: string[]
    if (numberOfMigrations === 'all') {
      migrationsToRollback = [...appliedMigrations].reverse()
    } else {
      migrationsToRollback = appliedMigrations
        .slice(-numberOfMigrations)
        .reverse()
    }

    for (const migration of migrationsToRollback) {
      const query = await fs.readFile(
        path.join(this.migrationsDir, `${migration}.down.sql`),
        'utf8',
      )
      await this.executeQuery(query)
      await this.executeQuery(this.deleteMigrationQuery, [migration])
      console.log(`Rolled back: ${migration}`)
    }
  }

  private async getPendingMigrations(): Promise<string[]> {
    const applied = await this.getAppliedMigrations()
    const files = await fs.readdir(this.migrationsDir)
    return files
      .filter((file) => file.endsWith('.up.sql'))
      .map((file) => file.replace('.up.sql', ''))
      .filter((name) => !applied.includes(name))
      .sort()
  }

  private async getAppliedMigrations(): Promise<string[]> {
    try {
      const result = await this.db.runAndReadAll(this.appliedMigrationsQuery)

      const rows = result.getRowObjects()

      return rows.map((row: any) => row.name)
    } catch (err) {
      console.error(
        'Error fetching applied migrations:',
        (err as Error).message,
      )
      throw err
    }
  }

  private async executeQuery(query: string, params: any[] = []): Promise<void> {
    if (params.length > 0) {
      await this.db.run(query, params)
    } else {
      await this.db.run(query)
    }
  }
}

export default Migrator
