import { Route, Switch } from 'wouter'

import Analytics from '@/pages/analytics'
import LoginForm from '@/pages/auth'
import Settings from '@/pages/settings'

function Routes() {
  return (
    <Switch>
      <Route path="/" component={Analytics} />
      <Route path="/settings" component={Settings} />
      <Route path="/login" component={LoginForm} />
    </Switch>
  )
}

export default Routes
