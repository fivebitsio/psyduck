import { createContext, type ReactNode, useEffect, useState } from 'react'

type Props = {
  children?: ReactNode
}

type IAuthContext = {
  authenticated?: boolean
  setToken: (token: string) => void
  signout: () => void
}

const initialValue = {
  authenticated: undefined,
  setToken: (_: string) => { },
  signout: () => { },
}

const AuthContext = createContext<IAuthContext>(initialValue)

const tokenKey = 'token'

const AuthProvider = ({ children }: Props) => {
  const [authenticated, setAuthenticated] = useState<boolean | undefined>(initialValue.authenticated)

  function setToken(token: string) {
    localStorage.setItem(tokenKey, token)

    setAuthenticated(true)
  }

  const signout = () => {
    localStorage.removeItem(tokenKey)
    setAuthenticated(false)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      setAuthenticated(true)
    } else {
      setAuthenticated(false)
    }

  }, [])

  return <AuthContext.Provider value={{ authenticated, setToken, signout }}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
