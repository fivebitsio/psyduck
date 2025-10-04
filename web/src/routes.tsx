import { Route, Switch } from 'wouter'

import AuthProtected from '@/components/auth-protected'
import Analytics from '@/pages/analytics'
import LoginForm from '@/pages/auth'
import Settings from '@/pages/settings'
import type { ComponentType } from 'react'

type ProtectedRouteProps = {
  path: string
  component: ComponentType
}

const ProtectedRoute = ({ path, component: Component }: ProtectedRouteProps) => (
  <Route path={path}>
    <AuthProtected>
      <Component />
    </AuthProtected>
  </Route>
)

function Routes() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Analytics} />
      <ProtectedRoute path="/settings" component={Settings} />
      <Route path="/login" component={LoginForm} />
    </Switch>
  )
}

export default Routes
