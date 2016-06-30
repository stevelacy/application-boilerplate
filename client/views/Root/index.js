/* eslint react/forbid-prop-types: 0 */
import React from 'react'
import { Provider } from 'react-redux'
import { Component, PropTypes } from 'core'
import { Router } from 'shasta-router'
import 'styles/globals.sass'

export default class RootView extends Component {
  static displayName = 'RootView'
  static propTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    routes: PropTypes.node.isRequired
  }

  componentWillMount() {
    console.time('First Render Time')
  }
  componentDidMount() {
    console.timeEnd('First Render Time')
  }
  render() {
    const { store, history, routes } = this.props
    return (
      <Provider store={store}>
        <Router history={history}>
          {routes}
        </Router>
      </Provider>
    )
  }
}
