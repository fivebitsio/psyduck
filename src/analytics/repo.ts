import * as ct from 'countries-and-timezones'
import { DuckDBConnection } from '@duckdb/node-api'
import {
  Metric,
  precision,
  VisitsByBrowser,
  VisitsByCountry,
  VisitsByDeviceType,
  VisitsByOs,
  VisitsByPage,
  VisitsBySource,
} from './types'
import * as queries from './queries'

function createAnalyticsRepo(duckdb: DuckDBConnection) {
  async function getVisits(
    from: string,
    to: string,
    precision: precision,
  ): Promise<Metric[]> {
    const result = await duckdb.runAndReadAll(queries.visits, {
      from,
      to,
      precision,
    })

    const rows = result.getRowObjects()

    return rows.map((row) => ({
      time: row.time?.toString() ?? '',
      count: Number(row.count),
    }))
  }

  async function getPageViews(
    from: string,
    to: string,
    precision: precision,
  ): Promise<Metric[]> {
    const result = await duckdb.runAndReadAll(queries.pageViews, {
      from,
      to,
      precision,
    })
    const rows = result.getRowObjects()

    return rows.map((row) => ({
      time: row.time?.toString() ?? '',
      count: Number(row.count),
    }))
  }

  async function getVisitsByCountry(
    from: string,
    to: string,
    limit: number,
  ): Promise<VisitsByCountry[]> {
    const result = await duckdb.runAndReadAll(queries.visitsByCountry, {
      from,
      to,
      limit,
    })

    const rows = result.getRowObjects()

    return rows.map((row) => ({
      countryCode: row.country_code?.toString() ?? '',
      countryName:
        ct.getCountry(row.country_code?.toString() ?? '')?.name ?? '',
      count: Number(row.count),
    }))
  }

  async function getVisitsByDeviceType(
    from: string,
    to: string,
  ): Promise<VisitsByDeviceType[]> {
    const result = await duckdb.runAndReadAll(queries.visitsByDeviceType, {
      from,
      to,
    })

    const rows = result.getRowObjects()

    return rows.map((row) => ({
      deviceType: row.deviceType?.toString() ?? '',
      count: Number(row.count),
    }))
  }

  async function getVisitsByBrowser(
    from: string,
    to: string,
  ): Promise<VisitsByBrowser[]> {
    const result = await duckdb.runAndReadAll(queries.visitsByBrowser, {
      from,
      to,
    })

    const rows = result.getRowObjects()

    return rows.map((row) => ({
      browser: row.browser?.toString() ?? '',
      count: Number(row.count),
    }))
  }

  async function getVisitsByOs(
    from: string,
    to: string,
  ): Promise<VisitsByOs[]> {
    const result = await duckdb.runAndReadAll(queries.visitsByOs, {
      from,
      to,
    })

    const rows = result.getRowObjects()

    return rows.map((row) => ({
      os: row.os?.toString() ?? '',
      count: Number(row.count),
    }))
  }

  async function getVisitsByPage(
    from: string,
    to: string,
    limit: number = 10,
  ): Promise<VisitsByPage[]> {
    const result = await duckdb.runAndReadAll(queries.visitsByPage, {
      from,
      to,
      limit,
    })

    const rows = result.getRowObjects()

    return rows.map((row) => ({
      pathname: row.pathname?.toString() ?? '',
      count: Number(row.count),
    }))
  }

  async function getVisitsBySource(
    from: string,
    to: string,
  ): Promise<VisitsBySource[]> {
    const result = await duckdb.runAndReadAll(queries.visitsBySource, {
      from,
      to,
    })

    const rows = result.getRowObjects()

    return rows.map((row) => ({
      source: row.referrer?.toString() ?? '',
      count: Number(row.count),
    }))
  }

  return {
    getVisits,
    getPageViews,
    getVisitsByCountry,
    getVisitsByDeviceType,
    getVisitsByBrowser,
    getVisitsByOs,
    getVisitsByPage,
    getVisitsBySource,
  }
}

export default createAnalyticsRepo
