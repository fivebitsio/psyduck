import { Navigate } from 'react-router'
import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Psyduck Documentation' },
    {
      name: 'description',
      content: 'Documentation for Psyduck Analytics'
    }
  ]
}

export default function Home() {
  return <Navigate to="/docs" replace />
}
