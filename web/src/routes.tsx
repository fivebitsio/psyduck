import { Route, Switch } from 'wouter'

import Analytics from '@/pages/analytics'
import LoginForm from '@/pages/auth'
import Settings from '@/pages/settings'
import AuthProtected from './components/auth-protected'

function Routes() {
  return (
    <Switch>
      <AuthProtected>
        <Route path="/" component={Analytics} />
        <Route path="/settings" component={Settings} />
      </AuthProtected>
      <Route path="/login" component={LoginForm} />
    </Switch>
  )
}

export default Routes
