import { isLoggedInAtom } from '@/atoms/auth'
import { useAtomValue } from 'jotai'
import { Redirect } from 'wouter'

interface Props {
  children?: React.ReactNode
}

function AuthProtected({ children }: Props) {
  const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'
  const isLoggedIn = useAtomValue(isLoggedInAtom)

  if (DEMO_MODE) return children
  if (isLoggedIn === false) return <Redirect to="/login" />
  if (isLoggedIn === undefined) return 'Loading...'

  return children
}

export default AuthProtected
