import type { DuckDBConnection } from '@duckdb/node-api'
import { DuckDBInstance } from '@duckdb/node-api'

let _duckdb: DuckDBConnection
let isInitialized: boolean = false

export async function initialize(): Promise<void> {
  if (isInitialized)
    return

  try {
    const duckDbInstance = await DuckDBInstance.create('../data/duck.db')
    _duckdb = await duckDbInstance.connect()

    isInitialized = true
  }
  catch (error) {
    console.error(error)
    throw new Error('error initializing dependencies')
  }
}

export function getDuckdb(): DuckDBConnection {
  return _duckdb
}
