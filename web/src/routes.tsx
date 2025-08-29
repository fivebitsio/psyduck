import Analytics from '@/pages/analytics'
import Settings from '@/pages/settings'
import { Route, Switch } from 'wouter'

function Routes() {
  return (
    <Switch>
      <Route path="/" component={Analytics} />
      <Route path="/settings" component={Settings} />
    </Switch>
  )
}

export default Routes
