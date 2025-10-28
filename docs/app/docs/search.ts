import { source } from '@/lib/source'
import { createFromSource } from 'fumadocs-core/search/server'

const server = createFromSource(source, {
  language: 'english'
})

export async function loader() {
  return server.staticGET()
}
