/* eslint react/forbid-prop-types: 0 */
import React from 'react'
import { Route, IndexRoute } from 'shasta-router'

import IndexView from 'views/Index'
import AccountView from 'views/Account'
import LoginView from 'views/Login'
import NotFoundView from 'views/NotFound'
import AccountOrdersView from 'views/Account/Orders'

const routes = (
  <Route path='/'>
    <IndexRoute component={IndexView} />
    <Route path='login' component={LoginView} />
    <Route path='account' component={AccountView} />
    <Route path='account/orders' component={AccountOrdersView} />
    <Route path='*' component={NotFoundView} />
  </Route>
)

export default routes
