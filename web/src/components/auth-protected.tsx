import { AuthContext } from '@/context/auth-context'
import { useContext } from 'react'
import { Redirect } from 'wouter'

interface Props {
  children?: React.ReactNode
}

function AuthProtected({ children }: Props) {
  const authContext = useContext(AuthContext)

  if (authContext.authenticated === false) {
    return <Redirect to='/login' />
  }

  if (authContext.authenticated === undefined) {
    return "Loading..."
  }

  return children
}

export default AuthProtected
